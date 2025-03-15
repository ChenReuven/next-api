import { NextRequest, NextResponse } from "next/server";

// Mock user database
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" },
];

// Mock token database
let tokens: { [key: string]: { userId: number; expires: Date } } = {};

// Generate a random token
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Authenticate user and create token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }
    
    // Find user
    const user = users.find(
      u => u.username === body.username && u.password === body.password
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Generate token with 1 hour expiration
    const token = generateToken();
    const expiresIn = 60 * 60 * 1000; // 1 hour in milliseconds
    
    tokens[token] = {
      userId: user.id,
      expires: new Date(Date.now() + expiresIn)
    };
    
    // Return token and user info (excluding password)
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      token,
      user: userWithoutPassword,
      expiresIn
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}

// Verify token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Check if token exists
    if (!tokens[token]) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Check if token has expired
    if (new Date() > tokens[token].expires) {
      // Remove expired token
      delete tokens[token];
      
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 401 }
      );
    }
    
    // Find user
    const userId = tokens[token].userId;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Return user info (excluding password)
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      expires: tokens[token].expires
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// Logout (invalidate token)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Check if token exists
    if (!tokens[token]) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Remove token
    delete tokens[token];
    
    return NextResponse.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
} 