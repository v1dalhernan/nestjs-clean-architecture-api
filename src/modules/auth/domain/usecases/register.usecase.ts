import { ConflictDomainException } from '../../../../core/domain/exceptions/domain.exception';
import { User } from '../entities/user.entity';
import { IPasswordHasher } from '../repositories/password-hasher.interface';
import { ITokenService } from '../repositories/token-service.interface';
import { IUserRepository } from '../repositories/user.repository.interface';

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthOutput {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  accessToken: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RegisterInput): Promise<AuthOutput> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictDomainException('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const id = crypto.randomUUID();

    const user = User.create({
      id,
      email: input.email,
      passwordHash,
      fullName: input.fullName,
    });

    const saved = await this.userRepository.save(user);
    const token = this.tokenService.signPayload({
      sub: saved.id,
      email: saved.email,
    });

    return {
      user: {
        id: saved.id,
        email: saved.email,
        fullName: saved.fullName,
      },
      accessToken: token,
    };
  }
}
