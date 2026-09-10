import { Task, TaskPriority, TaskStatus } from '../entities/task.entity';
import { ITaskRepository } from '../repositories/task.repository.interface';
import { CreateTaskUseCase } from './create-task.usecase';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateTaskUseCase(mockTaskRepository);
  });

  it('should create and save a new task with given properties', async () => {
    mockTaskRepository.save.mockImplementation(async (task: Task) => task);

    const task = await useCase.execute({
      title: 'Build clean architecture API',
      description: 'Implement domain, usecases, and typeorm',
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      userId: 'user-123',
    });

    expect(task.title).toBe('Build clean architecture API');
    expect(task.priority).toBe(TaskPriority.HIGH);
    expect(task.userId).toBe('user-123');
    expect(mockTaskRepository.save).toHaveBeenCalledTimes(1);
  });
});
