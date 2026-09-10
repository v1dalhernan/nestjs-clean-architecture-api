import { UnauthorizedDomainException } from '../../../../core/domain/exceptions/domain.exception';
import { User } from '../entities/user.entity';
import { IPasswordHasher } from '../repositories/password-hasher.interface';
import { ITokenService } from '../repositories/token-service.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { LoginUseCase } from './login.usecase';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
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

    useCase = new LoginUseCase(
      mockUserRepository,
      mockPasswordHasher,
      mockTokenService,
    );
  });

  it('should authenticate user and return token when credentials match', async () => {
    const user = new User('1', 'user@example.com', 'hashed_pw', 'User One', new Date(), new Date());
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(true);
    mockTokenService.signPayload.mockReturnValue('jwt.mock.token');

    const result = await useCase.execute({
      email: 'user@example.com',
      password: 'CorrectPassword!',
    });

    expect(result.user.email).toBe('user@example.com');
    expect(result.accessToken).toBe('jwt.mock.token');
  });

  it('should throw UnauthorizedDomainException when email is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'unknown@example.com',
        password: 'any',
      }),
    ).rejects.toThrow(UnauthorizedDomainException);
  });

  it('should throw UnauthorizedDomainException when password does not match', async () => {
    const user = new User('1', 'user@example.com', 'hashed_pw', 'User One', new Date(), new Date());
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: 'user@example.com',
        password: 'WrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedDomainException);
  });
});
