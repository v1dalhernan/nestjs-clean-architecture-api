import { ConflictDomainException } from '../../../../core/domain/exceptions/domain.exception';
import { User } from '../entities/user.entity';
import { IPasswordHasher } from '../repositories/password-hasher.interface';
import { ITokenService } from '../repositories/token-service.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { RegisterUseCase } from './register.usecase';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPasswordHasher: jest.Mocked<IPasswordHasher>;
  let mockTokenService: jest.Mocked<ITokenService>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    mockPasswordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    mockTokenService = {
      signPayload: jest.fn(),
    };

    useCase = new RegisterUseCase(
      mockUserRepository,
      mockPasswordHasher,
      mockTokenService,
    );
  });

  it('should register a new user successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue('hashed_secret');
    mockUserRepository.save.mockImplementation(async (user: User) => user);
    mockTokenService.signPayload.mockReturnValue('jwt.mock.token');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'Password123!',
      fullName: 'Test User',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBe('jwt.mock.token');
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictDomainException when email is already in use', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(
      new User('1', 'test@example.com', 'hash', 'Existing User', new Date(), new Date()),
    );

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'Password123!',
        fullName: 'Test User',
      }),
    ).rejects.toThrow(ConflictDomainException);

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
