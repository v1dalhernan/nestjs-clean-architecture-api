import { Task } from '../entities/task.entity';
import { ITaskRepository, TaskFilterOptions } from '../repositories/task.repository.interface';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string, filters?: TaskFilterOptions): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId, filters);
  }
}
