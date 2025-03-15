import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello world!" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: "Data received successfully", 
      data: body 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      error: "Invalid JSON payload" 
    }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: "Resource updated successfully", 
      data: body 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Invalid JSON payload" 
    }, { status: 400 });
  }
}

export async function DELETE() {
  return NextResponse.json({ 
    message: "Resource deleted successfully" 
  }, { status: 200 });
}
