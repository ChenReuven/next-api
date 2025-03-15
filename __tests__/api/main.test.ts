import { describe, expect, it } from '@jest/globals';
import { NextRequest } from 'next/server';
import { DELETE, GET, POST, PUT } from '../../app/route';

describe('Main API Route', () => {
  describe('GET method', () => {
    it('should return a hello world message', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual({ message: 'Hello world!' });
    });
  });
  
  describe('POST method', () => {
    it('should return the received data with status 201', async () => {
      const mockData = { name: 'Test User', email: 'test@example.com' };
      const request = new NextRequest('http://localhost:3000/api', {
        method: 'POST',
        body: JSON.stringify(mockData),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.message).toBe('Data received successfully');
      expect(data.data).toEqual(mockData);
    });
    
    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api', {
        method: 'POST',
        body: 'invalid json',
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid JSON payload');
    });
  });
  
  describe('PUT method', () => {
    it('should update resource successfully', async () => {
      const mockData = { id: 1, name: 'Updated User' };
      const request = new NextRequest('http://localhost:3000/api', {
        method: 'PUT',
        body: JSON.stringify(mockData),
      });
      
      const response = await PUT(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.message).toBe('Resource updated successfully');
      expect(data.data).toEqual(mockData);
    });
    
    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api', {
        method: 'PUT',
        body: 'invalid json',
      });
      
      const response = await PUT(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid JSON payload');
    });
  });
  
  describe('DELETE method', () => {
    it('should delete resource successfully', async () => {
      const response = await DELETE();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.message).toBe('Resource deleted successfully');
    });
  });
}); 