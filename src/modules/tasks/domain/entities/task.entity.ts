export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: TaskPriority,
    public readonly status: TaskStatus,
    public readonly dueDate: Date | null,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static create(props: {
    id: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: Date | null;
    userId: string;
  }): Task {
    const now = new Date();
    return new Task(
      props.id,
      props.title.trim(),
      props.description?.trim() || '',
      props.priority || TaskPriority.MEDIUM,
      props.status || TaskStatus.PENDING,
      props.dueDate || null,
      props.userId,
      now,
      now,
    );
  }

  public update(props: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: Date | null;
  }): Task {
    return new Task(
      this.id,
      props.title !== undefined ? props.title.trim() : this.title,
      props.description !== undefined ? props.description.trim() : this.description,
      props.priority !== undefined ? props.priority : this.priority,
      props.status !== undefined ? props.status : this.status,
      props.dueDate !== undefined ? props.dueDate : this.dueDate,
      this.userId,
      this.createdAt,
      new Date(),
    );
  }
}
