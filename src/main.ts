import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  // Ensure data directory exists for SQLite
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data', { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // OpenAPI / Swagger setup
  const config = new DocumentBuilder()
    .setTitle('TaskFlow REST API · Clean Architecture Showcase')
    .setDescription(
      'Production-grade RESTful API built with NestJS demonstrating Clean / Hexagonal Architecture, JWT Authentication, TypeORM with SQLite, and Unit Tests.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User registration, login, and profile operations')
    .addTag('Tasks', 'Task management CRUD operations with user isolation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
