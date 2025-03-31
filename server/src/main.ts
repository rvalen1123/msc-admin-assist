import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from './prisma/prisma.service';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  
  // Use Pino Logger
  app.useLogger(app.get(Logger));
  
  // Get Config Service
  const configService = app.get(ConfigService);
  const isProd = configService.get('NODE_ENV') === 'production';
  const port = configService.get('PORT', 3000);
  const apiPrefix = configService.get('API_PREFIX', '/api');
  const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:5173');
  
  // Enable shutdown hooks for Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  
  // Global middlewares
  // CORS configuration
  app.enableCors({
    origin: isProd ? frontendUrl : [frontendUrl, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: isProd ? undefined : false,
  }));
  
  // Response compression
  app.use(compression());
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // API prefix for all endpoints
  app.setGlobalPrefix(apiPrefix);
  
  // Swagger setup for non-production environments
  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('MSC Admin Portal API')
      .setDescription('API documentation for MSC Admin Portal')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }
  
  // In production, serve static frontend files
  if (isProd) {
    // Path to the frontend build folder (adjust based on your project structure)
    const frontendPath = join(__dirname, '..', '..', '..', 'dist');
    
    // Serve static files
    app.useStaticAssets(frontendPath, {
      index: false,
      maxAge: 86400000, // 1 day caching
    });
    
    // Serve SPA fallback
    app.use('*', (req, res, next) => {
      // Skip API routes
      if (req.originalUrl.startsWith(apiPrefix)) {
        next();
        return;
      }
      
      // Serve the index.html for all other routes (SPA routing)
      res.sendFile(join(frontendPath, 'index.html'));
    });
  }
  
  // Start the server
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
