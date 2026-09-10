import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../domain/repositories/password-hasher.interface';

@Injectable()
export class BcryptHasherService implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
