import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginUseCase } from './domain/usecases/login.usecase';
import { RegisterUseCase } from './domain/usecases/register.usecase';
import { TypeOrmUserEntity } from './infrastructure/persistence/typeorm-user.entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { BcryptHasherService } from './infrastructure/services/bcrypt-hasher.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmUserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-clean-architecture-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    TypeOrmUserRepository,
    BcryptHasherService,
    JwtTokenService,
    JwtStrategy,
    {
      provide: RegisterUseCase,
      useFactory: (
        repo: TypeOrmUserRepository,
        hasher: BcryptHasherService,
        tokenService: JwtTokenService,
      ) => new RegisterUseCase(repo, hasher, tokenService),
      inject: [TypeOrmUserRepository, BcryptHasherService, JwtTokenService],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        repo: TypeOrmUserRepository,
        hasher: BcryptHasherService,
        tokenService: JwtTokenService,
      ) => new LoginUseCase(repo, hasher, tokenService),
      inject: [TypeOrmUserRepository, BcryptHasherService, JwtTokenService],
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
