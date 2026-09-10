import { UnauthorizedDomainException } from '../../../../core/domain/exceptions/domain.exception';
import { IPasswordHasher } from '../repositories/password-hasher.interface';
import { ITokenService } from '../repositories/token-service.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { AuthOutput } from './register.usecase';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedDomainException('Invalid credentials');
    }

    const isMatch = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedDomainException('Invalid credentials');
    }

    const token = this.tokenService.signPayload({
      sub: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      accessToken: token,
    };
  }
}
