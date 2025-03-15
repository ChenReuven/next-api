import { createErrorResponse, createSuccessResponse } from '@/app/utils/api-helpers';
import { NextRequest } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Check if the request is a multipart form
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return createErrorResponse('Content type must be multipart/form-data', 400);
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Check if file exists
    if (!file) {
      return createErrorResponse('No file uploaded', 400);
    }

    // Access file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (buffer.byteLength > maxSize) {
      return createErrorResponse('File size exceeds 5MB limit', 400);
    }

    // Validate file type (example: only accept images)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return createErrorResponse('File type not allowed. Only JPG, PNG and GIF images are accepted', 400);
    }

    // Get filename and create safe version
    const fileName = file.name.replaceAll(' ', '_');
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // This is a mock operation - in a real app, you would need to ensure
    // the directory exists and handle errors properly
    // In this example, we're just pretending the upload was successful

    // In a real app, you would save the file:
    // await writeFile(path.join(uploadDir, uniqueFileName), buffer);

    // Return success with file info
    return createSuccessResponse({
      filename: uniqueFileName,
      size: buffer.byteLength,
      type: file.type,
      uploaded: true,
      url: `/uploads/${uniqueFileName}`
    }, 201);
  } catch (error) {
    console.error('Error uploading file:', error);
    return createErrorResponse('File upload failed', 500);
  }
}

export async function GET() {
  // Return upload instructions
  return createSuccessResponse({
    message: 'File upload API endpoint',
    instructions: 'Send a POST request with a multipart/form-data that includes a file field',
    restrictions: {
      maxSize: '5MB',
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
    }
  });
} 