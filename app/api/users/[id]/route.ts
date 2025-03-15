import { NextRequest, NextResponse } from "next/server";

// Mock database (same as in the users route)
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id);
  
  // Find the user by ID
  const user = users.find(user => user.id === userId);
  
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id);
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