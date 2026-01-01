// tests/unit/usecases/auth/LoginUserUseCase.test.js
const LoginUserUseCase = require('../../../../src/core/usecases/auth/LoginUserUseCase');
const ApplicationError = require('../../../../src/shared/errors/ApplicationError');

describe('LoginUserUseCase', () => {
  let mockRepository;
  let loginUseCase;

  beforeEach(() => {
    // Buat mock repository
    mockRepository = {
      findByEmail: jest.fn()
    };
    
    loginUseCase = new LoginUserUseCase(mockRepository);
  });

  it('should throw error when email is not provided', async () => {
    await expect(loginUseCase.execute('', 'password'))
      .rejects.toThrow('Email or password required');
  });

  it('should throw error when password is not provided', async () => {
    await expect(loginUseCase.execute('test@example.com', ''))
      .rejects.toThrow('Email or password required');
  });

  it('should throw error when user not found', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    
    await expect(loginUseCase.execute('nonexistent@test.com', 'password'))
      .rejects.toThrow('Invalid credentials');
  });

  it('should return user data when login successful', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'employee'
    };
    
    mockRepository.findByEmail.mockResolvedValue(mockUser);
    
    const result = await loginUseCase.execute('test@example.com', 'password');
    
    expect(result.user).toEqual({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'employee'
    });
  });

  it('should call repository with correct email', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    
    try {
      await loginUseCase.execute('test@example.com', 'password');
    } catch (error) {
      // Expected to throw error
    }
    
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});