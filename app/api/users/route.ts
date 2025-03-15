import { NextRequest, NextResponse } from "next/server";

// Mock database
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export async function GET(request: NextRequest) {
  // Get the search params
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Return specific user if id is provided
  if (id) {
    const user = users.find(user => user.id === parseInt(id));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  // Return all users
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }
    
    // Create new user with incremented ID
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      name: body.name,
      email: body.email
    };
    
    // Add to mock database
    users.push(newUser);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const userId = parseInt(id);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Update user with new data, preserving id
    users[userIndex] = {
      id: userId,
      name: body.name || users[userIndex].name,
      email: body.email || users[userIndex].email
    };
    
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }
  
  const userId = parseInt(id);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
  
  // Remove user from array
  const deletedUser = users[userIndex];
  users = users.filter(user => user.id !== userId);
  
  return NextResponse.json({
    message: "User deleted successfully",
    user: deletedUser
  });
} 