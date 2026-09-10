import { Task, TaskPriority, TaskStatus } from '../entities/task.entity';

export const TASK_REPOSITORY = 'TASK_REPOSITORY';

export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string, filters?: TaskFilterOptions): Promise<Task[]>;
  save(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}
