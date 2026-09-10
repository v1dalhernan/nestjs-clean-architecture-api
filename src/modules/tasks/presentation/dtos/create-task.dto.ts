import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../domain/entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete portfolio revamp', description: 'Title of the task' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiPropertyOptional({ example: 'Organize GitHub repositories and add Clean Architecture showcases' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: '2026-10-01T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
