# MSC Wound Care Admin Portal - Backend Architecture

## Project Structure

The backend is implemented in the `server` directory with the following structure:

```
server/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── aws.config.ts
│   ├── modules/               # Feature modules
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # User management
│   │   ├── customers/        # Customer management
│   │   ├── products/         # Product management
│   │   ├── forms/            # Form management
│   │   ├── orders/           # Order management
│   │   └── common/           # Shared module
│   ├── prisma/               # Prisma schema and migrations
│   │   └── schema.prisma
│   ├── common/               # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── types/                # TypeScript type definitions
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
```

## Technology Stack

### Core Technologies
- **Runtime**: Node.js with TypeScript
- **Framework**: NestJS (for robust API development)
- **Database**: PostgreSQL (for relational data) + Redis (for caching)
- **ORM**: Prisma (type-safe ORM)
- **Authentication**: JWT + OAuth2
- **API Documentation**: Swagger/OpenAPI
- **File Storage**: AWS S3
- **PDF Processing**: DocuSeal API integration
- **Email Service**: SendGrid
- **Logging**: Winston + ELK Stack
- **Monitoring**: Prometheus + Grafana

## Database Schema

The database schema is defined in `server/prisma/schema.prisma` and includes the following models:

- User
- Customer
- CustomerContact
- Product
- Manufacturer
- SalesRep
- FormTemplate
- FormSubmission
- Order
- OrderItem
- PriceHistory

## API Structure

### Authentication Module
```
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### User Management
```
GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
GET /api/users/me
PUT /api/users/me
```

### Customer Management
```
GET /api/customers
GET /api/customers/:id
POST /api/customers
PUT /api/customers/:id
DELETE /api/customers/:id
GET /api/customers/:id/contacts
POST /api/customers/:id/contacts
PUT /api/customers/:id/contacts/:contactId
DELETE /api/customers/:id/contacts/:contactId
```

### Product Management
```
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
GET /api/products/:id/price-history
POST /api/products/:id/price-history
```

### Form Management
```
GET /api/forms/templates
GET /api/forms/templates/:id
POST /api/forms/templates
PUT /api/forms/templates/:id
DELETE /api/forms/templates/:id
GET /api/forms/submissions
GET /api/forms/submissions/:id
POST /api/forms/submissions
PUT /api/forms/submissions/:id
DELETE /api/forms/submissions/:id
```

### Order Management
```
GET /api/orders
GET /api/orders/:id
POST /api/orders
PUT /api/orders/:id
DELETE /api/orders/:id
GET /api/orders/:id/items
POST /api/orders/:id/items
PUT /api/orders/:id/items/:itemId
DELETE /api/orders/:id/items/:itemId
```

## Security Measures

1. **Authentication & Authorization**
   - JWT-based authentication with refresh tokens
   - Role-based access control (RBAC)
   - OAuth2 integration for third-party services
   - Rate limiting on API endpoints

2. **Data Security**
   - Encryption at rest for sensitive data
   - HTTPS for all API communications
   - Input validation and sanitization
   - SQL injection prevention via Prisma
   - XSS protection

3. **File Security**
   - Secure file upload handling
   - Virus scanning for uploaded files
   - S3 bucket policies and encryption
   - Signed URLs for file access

## Performance Optimization

1. **Caching Strategy**
   - Redis caching for frequently accessed data
   - Cache invalidation policies
   - Distributed caching for scalability

2. **Database Optimization**
   - Indexed queries
   - Query optimization
   - Connection pooling
   - Read replicas for heavy read operations

3. **API Optimization**
   - Pagination for large datasets
   - GraphQL for flexible data fetching
   - Response compression
   - CDN integration for static assets

## Monitoring & Logging

1. **Application Monitoring**
   - Request/response metrics
   - Error tracking
   - Performance monitoring
   - Resource utilization

2. **Logging**
   - Structured logging with Winston
   - Log aggregation with ELK Stack
   - Audit logging for sensitive operations
   - Error tracking with Sentry

## Development Workflow

1. **Code Quality**
   - ESLint + Prettier for code formatting
   - Jest for unit testing
   - E2E testing with Cypress
   - Code coverage requirements

2. **Documentation**
   - API documentation with Swagger
   - Code documentation with TypeDoc
   - Architecture documentation
   - Deployment guides

3. **Version Control**
   - Git flow branching strategy
   - Semantic versioning
   - Automated changelog generation
   - Code review process

## Implementation Status

### Completed
- [x] Project structure setup
- [x] Database schema design
- [x] Environment configuration
- [x] Basic project documentation

### In Progress
- [ ] NestJS project initialization
- [ ] Database migrations
- [ ] Authentication module
- [ ] Core API endpoints

### Pending
- [ ] Testing infrastructure
- [ ] CI/CD pipeline
- [ ] Deployment configuration
- [ ] Monitoring setup
- [ ] Security audit

## Next Steps

1. Initialize NestJS project structure
2. Set up database migrations
3. Implement authentication system
4. Create core API endpoints
5. Set up testing infrastructure
6. Configure CI/CD pipeline
7. Deploy to staging environment
8. Perform security audit
9. Deploy to production 