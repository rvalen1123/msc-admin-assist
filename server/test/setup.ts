import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

export const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  customer: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  formSubmission: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  salesRep: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  manufacturer: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  formTemplate: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  customerContact: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  priceHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      'DOCUSEAL_API_KEY': 'test-api-key',
      'DOCUSEAL_API_URL': 'https://test.docuseal.co',
      'AZURE_SQL_CONNECTION_STRING': process.env.AZURE_SQL_CONNECTION_STRING,
      'JWT_SECRET': process.env.JWT_SECRET,
      'JWT_EXPIRATION': process.env.JWT_EXPIRATION,
      'AZURE_STORAGE_CONNECTION_STRING': process.env.AZURE_STORAGE_CONNECTION_STRING,
      'AZURE_STORAGE_CONTAINER': process.env.AZURE_STORAGE_CONTAINER,
      'SENDGRID_API_KEY': process.env.SENDGRID_API_KEY,
      'REDIS_URL': process.env.REDIS_URL,
    };
    return config[key];
  }),
};

// Create a real JWT service instance for testing
const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRATION },
});

export const mockJwtService = {
  sign: jest.fn((payload: any) => jwtService.sign(payload)),
  verify: jest.fn((token: string) => jwtService.verify(token)),
};

export const createTestingModule = async (module: any) => {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [() => mockConfigService],
      }),
      module,
    ],
    providers: [
      {
        provide: PrismaClient,
        useValue: mockPrismaService,
      },
      {
        provide: ConfigService,
        useValue: mockConfigService,
      },
      {
        provide: JwtService,
        useValue: mockJwtService,
      },
    ],
  }).compile();
}; 