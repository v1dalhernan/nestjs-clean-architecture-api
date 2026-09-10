import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jhonathan@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', minLength: 6, description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ example: 'Jhonathan Vidal', description: 'User full name' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;
}
