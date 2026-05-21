/**
 * User Service Unit Tests
 * Tests business logic with mocked repository
 */
const userService = require('../src/services/userService');
const userRepository = require('../src/repositories/userRepository');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../src/repositories/userRepository');
jest.mock('bcryptjs');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+90 555 123 4567',
    password: 'hashed_password',
    balance: 10000,
    role: 'user',
  };

  // ── register ──

  describe('register', () => {
    test('should register a new user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      userRepository.create.mockResolvedValue(mockUser);

      const input = { name: 'John Doe', email: 'john@example.com', password: 'test1234' };
      const result = await userService.register(input);

      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('test1234', 10);
    });

    test('should throw 409 when email is already registered', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const input = { name: 'John', email: 'john@example.com', password: 'test1234' };

      await expect(userService.register(input))
        .rejects.toThrow('Email is already registered');

      try {
        await userService.register(input);
      } catch (error) {
        expect(error.statusCode).toBe(409);
      }
    });
  });

  // ── login ──

  describe('login', () => {
    test('should login with valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userService.login('john@example.com', 'test1234');

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('john@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('test1234', 'hashed_password');
    });

    test('should throw 401 when email does not exist', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.login('unknown@example.com', 'test1234'))
        .rejects.toThrow('Invalid email or password');

      try {
        await userService.login('unknown@example.com', 'test1234');
      } catch (error) {
        expect(error.statusCode).toBe(401);
      }
    });

    test('should throw 401 when password is incorrect', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.login('john@example.com', 'wrong'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  // ── getProfile ──

  describe('getProfile', () => {
    test('should return user profile without password', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getProfile(1);

      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe('John Doe');
      expect(userRepository.findById).toHaveBeenCalledWith(1);
    });

    test('should throw 404 when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(userService.getProfile(999))
        .rejects.toThrow('User not found');

      try {
        await userService.getProfile(999);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // ── addBalance ──

  describe('addBalance', () => {
    test('should add balance successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.updateBalance.mockResolvedValue({ ...mockUser, balance: 10500 });

      const result = await userService.addBalance(1, 500);

      expect(result).not.toHaveProperty('password');
      expect(userRepository.updateBalance).toHaveBeenCalledWith(1, 10500);
    });

    test('should throw 400 when amount is not positive', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      await expect(userService.addBalance(1, 0))
        .rejects.toThrow('Amount must be positive');

      await expect(userService.addBalance(1, -100))
        .rejects.toThrow('Amount must be positive');
    });

    test('should throw 404 when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(userService.addBalance(999, 500))
        .rejects.toThrow('User not found');
    });
  });

  // ── createAdmin ──

  describe('createAdmin', () => {
    test('should create admin account successfully', async () => {
      const mockAdmin = { ...mockUser, role: 'admin' };
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      userRepository.create.mockResolvedValue(mockAdmin);

      const input = { name: 'Admin', email: 'admin@example.com', password: 'admin1234' };
      const result = await userService.createAdmin(input);

      expect(result).not.toHaveProperty('password');
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin' })
      );
    });

    test('should throw 409 when admin email is already taken', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const input = { name: 'Admin', email: 'john@example.com', password: 'admin1234' };

      await expect(userService.createAdmin(input))
        .rejects.toThrow('Email is already taken');

      try {
        await userService.createAdmin(input);
      } catch (error) {
        expect(error.statusCode).toBe(409);
      }
    });
  });

  // ── getAll ──

  describe('getAll', () => {
    test('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@test.com' },
        { id: 2, name: 'Jane', email: 'jane@test.com' },
      ];
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
      expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
