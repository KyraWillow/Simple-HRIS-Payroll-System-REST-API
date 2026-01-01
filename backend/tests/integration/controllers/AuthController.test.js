// tests/integration/controllers/AuthController.test.js
const request = require('supertest');
const express = require('express');
const AuthController = require('../../../src/interfaces/controllers/AuthController');
const LoginUserUseCase = require('../../../src/core/usecases/auth/LoginUserUseCase');

describe('AuthController Integration', () => {
  let app;
  let mockUseCase;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    };

    const controller = new AuthController(mockUseCase);
    
    app = express();
    app.use(express.json());
    app.post('/auth/login', controller.login.bind(controller));
  });

  it('should return 200 for successful login', async () => {
    mockUseCase.execute.mockResolvedValue({
      user: { 
        id: 1, 
        name: 'Test User', 
        email: 'test@example.com', 
        role: 'employee' 
      }
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  it('should return error for invalid credentials', async () => {
    mockUseCase.execute.mockRejectedValue(new Error('Invalid credentials'));

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrong' });

    expect(response.status).toBe(500); // Karena next(error)
  });

  it('should call use case with correct parameters', async () => {
    mockUseCase.execute.mockResolvedValue({
      user: { id: 1, name: 'Test', email: 'test@example.com', role: 'employee' }
    });

    await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(mockUseCase.execute).toHaveBeenCalledWith('test@example.com', 'password');
  });
});