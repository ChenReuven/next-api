# Next.js API Examples

This repository contains various examples of API routes using Next.js App Router.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Routes

This project demonstrates different types of API routes in Next.js:

### Basic Route Handlers

- `GET /api` - Returns a simple "Hello world!" message
- `POST /api` - Accepts JSON data and returns it with a success message
- `PUT /api` - Updates a resource (mock)
- `DELETE /api` - Deletes a resource (mock)

### Dynamic Route Parameters

- `GET /api/users/[id]` - Get a user by ID
- `PUT /api/users/[id]` - Update a user by ID
- `DELETE /api/users/[id]` - Delete a user by ID

### Users API

- `GET /api/users` - Get all users
- `GET /api/users?id=1` - Get a user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users?id=1` - Update a user
- `DELETE /api/users?id=1` - Delete a user

### Products API with Advanced Features

- `GET /api/products` - Get all products
- `GET /api/products?id=1` - Get a product by ID
- `GET /api/products?category=electronics` - Filter products by category
- `GET /api/products?minPrice=100&maxPrice=500` - Filter products by price range
- `GET /api/products?inStock=true` - Filter products by availability
- `GET /api/products?page=1&limit=10` - Paginate products
- `GET /api/products?sortBy=price&order=asc` - Sort products
- `POST /api/products` - Create a new product
- `PUT /api/products?id=1` - Update a product
- `DELETE /api/products?id=1` - Delete a product

### Authentication API

- `POST /api/auth` - Login and get a token
- `GET /api/auth` - Verify a token
- `DELETE /api/auth` - Logout (invalidate token)

### Validation with Zod

- `GET /api/validate` - Get schema information
- `POST /api/validate` - Validate user data with Zod schema

### File Upload

- `GET /api/upload` - Get upload instructions
- `POST /api/upload` - Upload a file (mock implementation)

### CORS Example

- `GET /api/cors-example` - Example endpoint with CORS support
- `POST /api/cors-example` - Post data with CORS support
- `OPTIONS /api/cors-example` - Handle CORS preflight requests

## Middleware

This project includes:

- `middleware.ts` - Protects API routes requiring authentication
- `app/api/cors.ts` - CORS utilities for API routes

## Utility Functions

- `app/utils/api-helpers.ts` - Helper functions for standardized API responses

## Technologies Used

- [Next.js](https://nextjs.org/) - The React Framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
