import { describe, expect, it } from '@jest/globals';
import { NextRequest } from 'next/server';
import { DELETE, GET, POST } from '../../app/api/auth/route';

describe('Auth API Route', () => {
  let authToken: string;
  
  describe('POST method (login)', () => {
    it('should authenticate valid credentials and return a token', async () => {
      const mockCredentials = { username: 'admin', password: 'admin123' };
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'POST',
        body: JSON.stringify(mockCredentials),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(1);
      expect(data.user.role).toBe('admin');
      expect(data.user.password).toBeUndefined(); // Password should not be returned
      
      // Save token for later tests
      authToken = data.token;
    });
    
    it('should reject invalid credentials', async () => {
      const mockCredentials = { username: 'admin', password: 'wrongpassword' };
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'POST',
        body: JSON.stringify(mockCredentials),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid credentials');
    });
    
    it('should validate required fields', async () => {
      const mockCredentials = { username: 'admin' }; // Missing password
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'POST',
        body: JSON.stringify(mockCredentials),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Username and password are required');
    });
  });
  
  describe('GET method (verify token)', () => {
    it('should verify a valid token', async () => {
      // First login to get a token
      const mockCredentials = { username: 'admin', password: 'admin123' };
      const loginRequest = new NextRequest('http://localhost:3000/api/auth', {
        method: 'POST',
        body: JSON.stringify(mockCredentials),
      });
      
      const loginResponse = await POST(loginRequest);
      const loginData = await loginResponse.json();
      const token = loginData.token;
      
      // Now verify the token
      const verifyRequest = new NextRequest('http://localhost:3000/api/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const response = await GET(verifyRequest);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(1);
      expect(data.user.role).toBe('admin');
      expect(data.expires).toBeDefined();
    });
    
    it('should reject missing token', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'GET',
      });
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Authorization header missing or invalid');
    });
    
    it('should reject invalid token format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'GET',
        headers: {
          'Authorization': 'InvalidTokenFormat',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Authorization header missing or invalid');
    });
    
    it('should reject invalid token', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalidtoken123',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });
  });
  
  describe('DELETE method (logout)', () => {
    it('should invalidate an existing token', async () => {
      // First login to get a token
      const mockCredentials = { username: 'admin', password: 'admin123' };
      const loginRequest = new NextRequest('http://localhost:3000/api/auth', {
        method: 'POST',
        body: JSON.stringify(mockCredentials),
      });
      
      const loginResponse = await POST(loginRequest);
      const loginData = await loginResponse.json();
      const token = loginData.token;
      
      // Now logout
      const logoutRequest = new NextRequest('http://localhost:3000/api/auth', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const response = await DELETE(logoutRequest);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.message).toBe('Logged out successfully');
      
      // Try to use the token again (should fail)
      const verifyRequest = new NextRequest('http://localhost:3000/api/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const verifyResponse = await GET(verifyRequest);
      const verifyData = await verifyResponse.json();
      
      expect(verifyResponse.status).toBe(401);
      expect(verifyData.error).toBe('Invalid token');
    });
    
    it('should reject missing token on logout', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'DELETE',
      });
      
      const response = await DELETE(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Authorization header missing or invalid');
    });
  });
}); 