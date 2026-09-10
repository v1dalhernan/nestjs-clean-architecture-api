import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../../../../core/domain/exceptions/domain.exception';
import { CurrentUser, CurrentUserPayload } from '../../../auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { CreateTaskUseCase } from '../../domain/usecases/create-task.usecase';
import { DeleteTaskUseCase } from '../../domain/usecases/delete-task.usecase';
import { GetTasksUseCase } from '../../domain/usecases/get-tasks.usecase';
import { UpdateTaskUseCase } from '../../domain/usecases/update-task.usecase';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskQueryDto } from '../dtos/task-query.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks for current authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns list of tasks' })
  async getTasks(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: TaskQueryDto,
  ) {
    return await this.getTasksUseCase.execute(user.userId, {
      status: query.status,
      priority: query.priority,
      search: query.search,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTask(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateTaskDto,
  ) {
    try {
      return await this.createTaskUseCase.execute({
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        userId: user.userId,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Forbidden: not your task' })
  async updateTask(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    try {
      return await this.updateTaskUseCase.execute({
        id,
        userId: user.userId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      });
    } catch (e) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundException(e.message);
      }
      if (e instanceof UnauthorizedDomainException) {
        throw new ForbiddenException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Forbidden: not your task' })
  async deleteTask(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    try {
      await this.deleteTaskUseCase.execute(id, user.userId);
    } catch (e) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundException(e.message);
      }
      if (e instanceof UnauthorizedDomainException) {
        throw new ForbiddenException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }
}
