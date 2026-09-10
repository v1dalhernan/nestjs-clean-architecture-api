import { Task, TaskPriority, TaskStatus } from '../entities/task.entity';
import { ITaskRepository } from '../repositories/task.repository.interface';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
  userId: string;
}

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const id = crypto.randomUUID();
    const task = Task.create({
      id,
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: input.status,
      dueDate: input.dueDate,
      userId: input.userId,
    });

    return await this.taskRepository.save(task);
  }
}
