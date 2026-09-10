import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { TypeOrmUserEntity } from './typeorm-user.entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntity)
    private readonly repo: Repository<TypeOrmUserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.repo.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async save(user: User): Promise<User> {
    const entity = this.toPersistence(user);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(record: TypeOrmUserEntity): User {
    return new User(
      record.id,
      record.email,
      record.passwordHash,
      record.fullName,
      record.createdAt,
      record.updatedAt,
    );
  }

  private toPersistence(user: User): TypeOrmUserEntity {
    const entity = new TypeOrmUserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.fullName = user.fullName;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}
