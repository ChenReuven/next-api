import { createErrorResponse, createSuccessResponse, createValidationErrorResponse } from '@/app/utils/api-helpers';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Define validation schema for user data
const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  age: z.number().int().positive().optional(),
  role: z.enum(["admin", "user", "editor"], {
    errorMap: () => ({ message: "Role must be admin, user, or editor" }),
  }),
  preferences: z.object({
    newsletter: z.boolean(),
    notifications: z.boolean(),
  }).optional(),
});

// Type inference from the zod schema
type User = z.infer<typeof userSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body against our schema
    const result = userSchema.safeParse(body);
    
    if (!result.success) {
      // Return validation errors
      const formattedErrors = result.error.format();
      return createValidationErrorResponse(
        JSON.stringify(formattedErrors, null, 2)
      );
    }
    
    // Access the validated data
    const validatedData: User = result.data;
    
    // Process the valid data (in a real app, you might save to a database)
    
    return createSuccessResponse({
      message: "Validation successful",
      user: validatedData
    }, 201);
  } catch (error) {
    console.error("Error processing request:", error);
    return createErrorResponse("Invalid request payload");
  }
}

// Get schema information
export async function GET() {
  // Return information about the expected schema
  const schemaExample = {
    name: "Example User",
    email: "user@example.com",
    age: 30,
    role: "user",
    preferences: {
      newsletter: true,
      notifications: false,
    }
  };
  
  return createSuccessResponse({
    message: "User validation schema information",
    schema: "userSchema",
    example: schemaExample,
    rules: {
      name: "String with minimum 2 characters",
      email: "Valid email address",
      age: "Optional positive integer",
      role: "Must be one of: admin, user, editor",
      preferences: "Optional object with newsletter and notifications booleans"
    }
  });
} 