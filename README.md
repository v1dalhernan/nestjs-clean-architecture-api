# TaskFlow REST API · NestJS Clean Architecture Showcase

[![NestJS](https://img.shields.io/badge/NestJS-10+-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2F%20Hexagonal-2EA44F)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?logo=swagger&logoColor=black)](https://swagger.io)
[![Tests](https://img.shields.io/badge/Tests-Passing%20(100%25)-brightgreen)](src/)

A robust, enterprise-ready RESTful API built with **NestJS**, demonstrating **Clean / Hexagonal Architecture**, **JWT Authentication (Passport)**, **TypeORM with SQLite**, **Class Validator**, and **Unit Testing with Jest**.

---

## 🏛️ Architecture Overview

The application follows strict **Dependency Inversion**: inner layers (Domain) have zero knowledge of frameworks, ORMs, or HTTP protocols. External details (TypeORM, Express, Passport) depend inwards on Domain interfaces.

```mermaid
flowchart TD
    subgraph Presentation["🌐 Presentation Layer (HTTP / REST)"]
        CTRL["Controllers\n(AuthController, TasksController)"]
        DTO["DTOs & Validation\n(RegisterDto, LoginDto, CreateTaskDto)"]
        GUARDS["Guards & Decorators\n(JwtAuthGuard, CurrentUser)"]
        DOCS["Swagger / OpenAPI\n(@ApiTags, @ApiResponse)"]
        CTRL --> DTO
        CTRL --> GUARDS
    end

    subgraph Domain["🧠 Core Domain Layer (Pure TypeScript)"]
        UC["Use Cases / Interactors\n(RegisterUseCase, LoginUseCase, GetTasksUseCase, CreateTaskUseCase)"]
        ENTITIES["Entities & Value Objects\n(User, Task, TaskPriority, TaskStatus)"]
        INTERFACES["Repository Contracts\n(IUserRepository, ITaskRepository, IPasswordHasher, ITokenService)"]
        EXCEPTIONS["Domain Exceptions\n(NotFoundDomainException, UnauthorizedDomainException)"]
        UC --> ENTITIES
        UC --> INTERFACES
        UC --> EXCEPTIONS
    end

    subgraph Infrastructure["💾 Infrastructure Layer (TypeORM & Security)"]
        REPO_IMPL["Repository Implementations\n(TypeOrmUserRepository, TypeOrmTaskRepository)"]
        ORM_ENTITIES["TypeORM Persistence Models\n(TypeOrmUserEntity, TypeOrmTaskEntity)"]
        SERVICES["Security Services\n(BcryptHasherService, JwtTokenService, JwtStrategy)"]
        REPO_IMPL --> ORM_ENTITIES
    end

    CTRL --> UC
    REPO_IMPL -.->|Implements| INTERFACES
    SERVICES -.->|Implements| INTERFACES
```

### Layer Responsibilities

| Layer | Responsibility | Dependencies |
| :--- | :--- | :--- |
| **Domain** | Contains pure business entities, validation rules, repository interfaces, and use cases. | None (Pure TypeScript) |
| **Infrastructure** | Implements domain contracts using external adapters: TypeORM persistence, bcrypt password hashing, and Passport JWT strategy. | `typeorm`, `sqlite3`, `bcrypt`, `passport-jwt` |
| **Presentation** | Handles HTTP requests, DTO validation pipelines, route guards, Swagger documentation, and maps domain exceptions to HTTP statuses. | `@nestjs/common`, `@nestjs/swagger`, `class-validator` |

---

## 📁 Project Structure

```
src/
├── app.module.ts                         # Root application module & TypeORM SQLite config
├── main.ts                               # Bootstrap: ValidationPipe, CORS, Swagger setup
├── core/
│   └── domain/
│       └── exceptions/                   # Custom domain exception hierarchy
└── modules/
    ├── auth/
    │   ├── auth.module.ts                # Module wiring & dependency injection
    │   ├── domain/
    │   │   ├── entities/                 # User entity
    │   │   ├── repositories/             # IUserRepository, IPasswordHasher, ITokenService
    │   │   └── usecases/                 # RegisterUseCase, LoginUseCase
    │   ├── infrastructure/
    │   │   ├── persistence/              # TypeOrmUserEntity, TypeOrmUserRepository
    │   │   ├── services/                 # BcryptHasherService, JwtTokenService
    │   │   └── strategies/               # JwtStrategy (Passport)
    │   └── presentation/
    │       ├── controllers/              # AuthController
    │       ├── dtos/                     # RegisterDto, LoginDto
    │       ├── guards/                   # JwtAuthGuard
    │       └── decorators/               # @CurrentUser()
    └── tasks/
        ├── tasks.module.ts
        ├── domain/
        │   ├── entities/                 # Task entity, TaskPriority, TaskStatus
        │   ├── repositories/             # ITaskRepository contract
        │   └── usecases/                 # GetTasks, CreateTask, UpdateTask, DeleteTask
        ├── infrastructure/
        │   └── persistence/              # TypeOrmTaskEntity, TypeOrmTaskRepository
        └── presentation/
            ├── controllers/              # TasksController
            └── dtos/                     # CreateTaskDto, UpdateTaskDto, TaskQueryDto
```

---

## ✨ Key Features

- **JWT Authentication Flow**: Secure user registration, password hashing with bcrypt, and signed JWT issuance.
- **Resource Ownership & User Isolation**: Tasks are strictly bound to their creator; cross-user mutations are rejected at the use case level.
- **Dynamic Filtering & Search**: Query tasks by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`), priority (`LOW`, `MEDIUM`, `HIGH`), and text search.
- **Self-Contained SQLite Database**: Zero database configuration required—TypeORM automatically sets up SQLite on startup.
- **Interactive Swagger Documentation**: Full OpenAPI 3.0 documentation with JWT Authorization support at `/api/docs`.
- **Unit Testing**: 100% passing unit tests covering all Use Cases with mocked repositories.

---

## 📚 API Endpoints (Swagger Preview)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT Bearer token | No |
| `GET` | `/api/auth/profile` | Get current authenticated user details | Yes (Bearer) |
| `GET` | `/api/tasks` | List all tasks for current user (supports filters) | Yes (Bearer) |
| `POST` | `/api/tasks` | Create a new task | Yes (Bearer) |
| `PATCH` | `/api/tasks/:id` | Update an existing task | Yes (Bearer) |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes (Bearer) |

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Build for production
npm run build
```

---

## 🚀 Getting Started

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/v1dalhernan/nestjs-clean-architecture-api.git
cd nestjs-clean-architecture-api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start the application in development mode
npm run start:dev
```

Once running:
- **API Base URL**: `http://localhost:3000/api`
- **Interactive Swagger Docs**: `http://localhost:3000/api/docs`

---

## 👤 Author

**Jhonathan Vidal**
- GitHub: [@v1dalhernan](https://github.com/v1dalhernan)
- LinkedIn: [Jhonathan Vidal](https://www.linkedin.com/in/jhonathan-vidal/)
