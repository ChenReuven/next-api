import { NextRequest, NextResponse } from "next/server";

// Mock database
let products = [
  { id: 1, name: "Laptop", price: 999.99, category: "electronics", inStock: true },
  { id: 2, name: "Smartphone", price: 699.99, category: "electronics", inStock: true },
  { id: 3, name: "Headphones", price: 149.99, category: "accessories", inStock: true },
  { id: 4, name: "Monitor", price: 299.99, category: "electronics", inStock: false },
  { id: 5, name: "Keyboard", price: 89.99, category: "accessories", inStock: true },
  { id: 6, name: "Mouse", price: 49.99, category: "accessories", inStock: true },
  { id: 7, name: "Tablet", price: 399.99, category: "electronics", inStock: true },
  { id: 8, name: "Printer", price: 199.99, category: "electronics", inStock: false },
  { id: 9, name: "Camera", price: 599.99, category: "electronics", inStock: true },
  { id: 10, name: "Speaker", price: 129.99, category: "accessories", inStock: true },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get filters
  const id = searchParams.get("id");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  
  // Get pagination params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  
  // Get sort params
  const sortBy = searchParams.get("sortBy") || "id";
  const order = searchParams.get("order") || "asc";
  
  // Get specific product if ID is provided
  if (id) {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  }
  
  // Apply filters
  let filteredProducts = [...products];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  if (inStock !== null && inStock !== undefined) {
    const inStockBool = inStock === "true";
    filteredProducts = filteredProducts.filter(p => p.inStock === inStockBool);
  }
  
  // Apply sorting
  filteredProducts.sort((a, b) => {
    if (order === "asc") {
      return a[sortBy as keyof typeof a] > b[sortBy as keyof typeof b] ? 1 : -1;
    } else {
      return a[sortBy as keyof typeof a] < b[sortBy as keyof typeof b] ? 1 : -1;
    }
  });
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Create pagination metadata
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);
  
  // Return data with metadata
  return NextResponse.json({
    data: paginatedProducts,
    meta: {
      currentPage: page,
      totalPages,
      totalProducts,
      limit
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }
    
    // Create new product with incremented ID
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      inStock: body.inStock !== undefined ? body.inStock : true
    };
    
    // Add to mock database
    products.push(newProduct);
    
    return NextResponse.json(newProduct, { status: 201 });
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const productId = parseInt(id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Update product with new data, preserving id
    products[productIndex] = {
      id: productId,
      name: body.name || products[productIndex].name,
      price: body.price !== undefined ? parseFloat(body.price) : products[productIndex].price,
      category: body.category || products[productIndex].category,
      inStock: body.inStock !== undefined ? body.inStock : products[productIndex].inStock
    };
    
    return NextResponse.json(products[productIndex]);
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
      { error: "Product ID is required" },
      { status: 400 }
    );
  }
  
  const productId = parseInt(id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }
  
  // Remove product from array
  const deletedProduct = products[productIndex];
  products = products.filter(p => p.id !== productId);
  
  return NextResponse.json({
    message: "Product deleted successfully",
    product: deletedProduct
  });
} 