import {
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../../../../core/domain/exceptions/domain.exception';
import { ITaskRepository } from '../repositories/task.repository.interface';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundDomainException('Task not found');
    }

    if (task.userId !== userId) {
      throw new UnauthorizedDomainException('You cannot delete a task you do not own');
    }

    await this.taskRepository.delete(id);
  }
}
