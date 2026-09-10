import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ConflictDomainException,
  UnauthorizedDomainException,
} from '../../../../core/domain/exceptions/domain.exception';
import { LoginUseCase } from '../../domain/usecases/login.usecase';
import { RegisterUseCase } from '../../domain/usecases/register.usecase';
import { CurrentUser, CurrentUserPayload } from '../decorators/current-user.decorator';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.registerUseCase.execute(dto);
    } catch (e) {
      if (e instanceof ConflictDomainException) {
        throw new ConflictException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiResponse({ status: 200, description: 'User authenticated, returns JWT' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUseCase.execute(dto);
    } catch (e) {
      if (e instanceof UnauthorizedDomainException) {
        throw new UnauthorizedException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user info' })
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    return user;
  }
}
