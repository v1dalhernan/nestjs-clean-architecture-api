import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTaskUseCase } from './domain/usecases/create-task.usecase';
import { DeleteTaskUseCase } from './domain/usecases/delete-task.usecase';
import { GetTasksUseCase } from './domain/usecases/get-tasks.usecase';
import { UpdateTaskUseCase } from './domain/usecases/update-task.usecase';
import { TypeOrmTaskEntity } from './infrastructure/persistence/typeorm-task.entity';
import { TypeOrmTaskRepository } from './infrastructure/persistence/typeorm-task.repository';
import { TasksController } from './presentation/controllers/tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmTaskEntity])],
  controllers: [TasksController],
  providers: [
    TypeOrmTaskRepository,
    {
      provide: GetTasksUseCase,
      useFactory: (repo: TypeOrmTaskRepository) => new GetTasksUseCase(repo),
      inject: [TypeOrmTaskRepository],
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (repo: TypeOrmTaskRepository) => new CreateTaskUseCase(repo),
      inject: [TypeOrmTaskRepository],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (repo: TypeOrmTaskRepository) => new UpdateTaskUseCase(repo),
      inject: [TypeOrmTaskRepository],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (repo: TypeOrmTaskRepository) => new DeleteTaskUseCase(repo),
      inject: [TypeOrmTaskRepository],
    },
  ],
})
export class TasksModule {}
