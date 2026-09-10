import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../domain/repositories/token-service.interface';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  signPayload(payload: { sub: string; email: string }): string {
    return this.jwtService.sign(payload);
  }
}
