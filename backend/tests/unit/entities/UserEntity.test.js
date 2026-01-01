// tests/unit/entities/UserEntity.test.js
const UserEntity = require('../../../src/core/entities/User.entity');

describe('UserEntity', () => {
  it('should create user entity with valid data', () => {
    const user = new UserEntity(1, 'John Doe', 'john@example.com', 'password123', 'employee', 5000000, new Date());
    
    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe('employee');
  });

  it('should validate email format', () => {
    const user = new UserEntity(1, 'John Doe', 'invalid-email', 'password123');
    
    expect(() => user.validate()).toThrow('Email is required and must be valid');
  });

  it('should validate name length', () => {
    const user = new UserEntity(1, 'A', 'john@example.com', 'password123');
    
    expect(() => user.validate()).toThrow('Name is required and must be at least 2 characters long');
  });

  it('should validate valid email and name', () => {
    const user = new UserEntity(1, 'John Doe', 'john@example.com', 'password123');
    
    expect(() => user.validate()).not.toThrow();
  });

  it('should return true for valid email format', () => {
    const user = new UserEntity(1, 'John Doe', 'john@example.com', 'password123');
    
    expect(user.isValidEmail('john@example.com')).toBe(true);
    expect(user.isValidEmail('invalid-email')).toBe(false);
  });
});