import { UserRole } from '../../modules/users/enums/user-role.enum';

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
  formTemplate: {
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
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createMany: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createMany: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
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
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

export const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByManufacturer: jest.fn(),
  updatePrice: jest.fn(),
};

export const mockCustomersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findCustomerContacts: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      'DOCUSEAL_API_KEY': 'test-api-key',
      'DOCUSEAL_API_URL': 'https://test.docuseal.co',
      'AZURE_SQL_CONNECTION_STRING': 'test-connection-string',
      'JWT_SECRET': 'test-jwt-secret',
      'JWT_EXPIRATION': '1h',
      'AZURE_STORAGE_CONNECTION_STRING': 'test-storage-connection',
      'AZURE_STORAGE_CONTAINER': 'test-container',
      'SENDGRID_API_KEY': 'test-sendgrid-key',
      'REDIS_URL': 'redis://localhost:6379',
    };
    return config[key];
  }),
};

export const mockFormsService = {
  createTemplate: jest.fn(),
  findAllTemplates: jest.fn(),
  findTemplateById: jest.fn(),
  createSubmission: jest.fn(),
  findAllSubmissions: jest.fn(),
  findSubmissionById: jest.fn(),
  updateSubmissionStatus: jest.fn(),
  getSubmissionPdf: jest.fn(),
};

export const mockOrdersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  updateStatus: jest.fn(),
}; 