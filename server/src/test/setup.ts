import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const mockPrismaService = {
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
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      'DOCUSEAL_API_KEY': 'test-api-key',
      'DOCUSEAL_API_URL': 'https://test.docuseal.co',
      'AZURE_SQL_CONNECTION_STRING': 'test-connection-string',
      'JWT_SECRET': 'test-secret',
      'JWT_EXPIRATION': '1h',
      'AZURE_STORAGE_CONNECTION_STRING': 'test-storage-connection',
      'AZURE_STORAGE_CONTAINER': 'test-container',
      'SENDGRID_API_KEY': 'test-sendgrid-key',
      'REDIS_URL': 'redis://localhost:6379',
    };
    return config[key];
  }),
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
    ],
  }).compile();
}; 