import { describe, expect, it } from '@jest/globals';
import { NextRequest } from 'next/server';
import { DELETE, GET, POST, PUT } from '../../app/api/users/route';

describe('Users API Route', () => {
  describe('GET method', () => {
    it('should return all users when no ID is provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
    
    it('should return a specific user when ID is provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/users?id=1');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.id).toBe(1);
      expect(data.name).toBe('John Doe');
    });
    
    it('should return 404 for non-existent user', async () => {
      const request = new NextRequest('http://localhost:3000/api/users?id=999');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });
  });
  
  describe('POST method', () => {
    it('should create a new user', async () => {
      const mockUser = { name: 'New User', email: 'new@example.com' };
      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(mockUser),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.name).toBe(mockUser.name);
      expect(data.email).toBe(mockUser.email);
    });
    
    it('should return 400 when required fields are missing', async () => {
      const mockUser = { email: 'invalid@example.com' }; // Missing name
      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(mockUser),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name and email are required');
    });
  });
  
  describe('PUT method', () => {
    it('should update an existing user', async () => {
      const mockUpdate = { name: 'Updated User' };
      const request = new NextRequest('http://localhost:3000/api/users?id=1', {
        method: 'PUT',
        body: JSON.stringify(mockUpdate),
      });
      
      const response = await PUT(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.id).toBe(1);
      expect(data.name).toBe(mockUpdate.name);
    });
    
    it('should return 400 when ID is missing', async () => {
      const mockUpdate = { name: 'Updated User' };
      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'PUT',
        body: JSON.stringify(mockUpdate),
      });
      
      const response = await PUT(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('User ID is required');
    });
    
    it('should return 404 for non-existent user', async () => {
      const mockUpdate = { name: 'Updated User' };
      const request = new NextRequest('http://localhost:3000/api/users?id=999', {
        method: 'PUT',
        body: JSON.stringify(mockUpdate),
      });
      
      const response = await PUT(request);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });
  });
  
  describe('DELETE method', () => {
    it('should delete an existing user', async () => {
      const request = new NextRequest('http://localhost:3000/api/users?id=2');
      
      const response = await DELETE(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.message).toBe('User deleted successfully');
      expect(data.user).toBeDefined();
    });
    
    it('should return 400 when ID is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/users');
      
      const response = await DELETE(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('User ID is required');
    });
    
    it('should return 404 for non-existent user', async () => {
      const request = new NextRequest('http://localhost:3000/api/users?id=999');
      
      const response = await DELETE(request);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });
  });
}); 