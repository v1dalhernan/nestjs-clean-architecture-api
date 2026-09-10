import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../domain/entities/task.entity';
import {
  ITaskRepository,
  TaskFilterOptions,
} from '../../domain/repositories/task.repository.interface';
import { TypeOrmTaskEntity } from './typeorm-task.entity';

@Injectable()
export class TypeOrmTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TypeOrmTaskEntity)
    private readonly repo: Repository<TypeOrmTaskEntity>,
  ) {}

  async findById(id: string): Promise<Task | null> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByUserId(userId: string, filters?: TaskFilterOptions): Promise<Task[]> {
    const qb = this.repo.createQueryBuilder('task').where('task.userId = :userId', { userId });

    if (filters?.status) {
      qb.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      qb.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    if (filters?.search) {
      qb.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    qb.orderBy('task.createdAt', 'DESC');

    const records = await qb.getMany();
    return records.map((r) => this.toDomain(r));
  }

  async save(task: Task): Promise<Task> {
    const entity = this.toPersistence(task);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  private toDomain(record: TypeOrmTaskEntity): Task {
    return new Task(
      record.id,
      record.title,
      record.description,
      record.priority,
      record.status,
      record.dueDate,
      record.userId,
      record.createdAt,
      record.updatedAt,
    );
  }

  private toPersistence(task: Task): TypeOrmTaskEntity {
    const entity = new TypeOrmTaskEntity();
    entity.id = task.id;
    entity.title = task.title;
    entity.description = task.description;
    entity.priority = task.priority;
    entity.status = task.status;
    entity.dueDate = task.dueDate;
    entity.userId = task.userId;
    entity.createdAt = task.createdAt;
    entity.updatedAt = task.updatedAt;
    return entity;
  }
}
