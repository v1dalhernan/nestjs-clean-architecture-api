import {
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../../../../core/domain/exceptions/domain.exception';
import { Task, TaskPriority, TaskStatus } from '../entities/task.entity';
import { ITaskRepository } from '../repositories/task.repository.interface';

export interface UpdateTaskInput {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const task = await this.taskRepository.findById(input.id);
    if (!task) {
      throw new NotFoundDomainException('Task not found');
    }

    if (task.userId !== input.userId) {
      throw new UnauthorizedDomainException('You cannot update a task you do not own');
    }

    const updatedTask = task.update({
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: input.status,
      dueDate: input.dueDate,
    });

    return await this.taskRepository.save(updatedTask);
  }
}
