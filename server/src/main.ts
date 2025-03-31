import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import helmet from 'helmet';
import * as compression from 'compression';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // Enable compression
  app.use(compression({
    level: 6, // Compression level (1-9, higher = better compression but slower)
    threshold: 1024, // Only compress responses larger than 1KB
  }));

  // Request size limits
  app.use(json({ limit: '10mb' })); // Limit JSON payloads to 10MB
  app.use(urlencoded({ extended: true, limit: '10mb' })); // Limit URL-encoded payloads to 10MB

  // Enable CORS with enhanced security
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:5173',
      process.env.FRONTEND_URL || 'http://localhost:8080'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600, // Cache preflight requests for 1 hour
  });

  // Global validation pipe with enhanced security
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));

  // Get references to services from the container
  const reflector = app.get(Reflector);
  
  // Global rate limiting guard - fixed with proper parameters
  // Don't apply in the main.ts file as it needs the container services
  // We already have it configured in app.module.ts

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('MSC Wound Care API')
    .setDescription('The MSC Wound Care Admin Portal API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Add health check endpoint
  app.use('/health', (req, res) => {
    res.status(200).send({ status: 'ok' });
  });

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}

bootstrap(); 