import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { mockPrismaService, mockJwtService, createTestingModule } from './setup';

describe('FormsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminToken: string;
  let salesRepToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestingModule(AppModule);
    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Mock user data
    const mockAdminUser = {
      id: 'admin-1',
      email: 'admin@test.com',
      role: 'ADMIN',
      passwordHash: 'hashed-password',
    };

    const mockSalesRepUser = {
      id: 'sales-rep-1',
      email: 'salesrep@test.com',
      role: 'SALES',
      passwordHash: 'hashed-password',
    };

    // Mock Prisma responses
    mockPrismaService.user.findUnique.mockImplementation(({ where }) => {
      if (where.email === 'admin@test.com') return mockAdminUser;
      if (where.email === 'salesrep@test.com') return mockSalesRepUser;
      return null;
    });

    // Get tokens using mocked JWT service
    adminToken = mockJwtService.sign();
    salesRepToken = mockJwtService.sign();
  });

  afterAll(async () => {
    // Clear all mocks
    jest.clearAllMocks();
    await app.close();
  });

  describe('POST /forms', () => {
    let templateId: string;
    let customerId: string;

    beforeAll(() => {
      // Mock template and customer data
      const mockTemplate = {
        id: 'template-1',
        type: 'TEST_FORM',
        title: 'Test Form',
        description: 'Test Description',
        schema: JSON.stringify({ fields: [] }),
      };

      const mockCustomer = {
        id: 'customer-1',
        name: 'Test Customer',
        email: 'customer@test.com',
        phone: '1234567890',
      };

      templateId = mockTemplate.id;
      customerId = mockCustomer.id;

      // Mock Prisma responses
      mockPrismaService.formTemplate.create.mockResolvedValue(mockTemplate);
      mockPrismaService.customer.create.mockResolvedValue(mockCustomer);
      mockPrismaService.formSubmission.create.mockResolvedValue({
        id: 'submission-1',
        templateId: mockTemplate.id,
        userId: 'admin-1',
        customerId: mockCustomer.id,
        data: JSON.stringify({ test: 'data' }),
        status: 'DRAFT',
      });
    });

    it('should create a new form submission (admin)', () => {
      return request(app.getHttpServer())
        .post('/forms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          templateId,
          customerId,
          data: { test: 'data' },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.status).toBe('DRAFT');
          expect(res.body.templateId).toBe(templateId);
          expect(res.body.customerId).toBe(customerId);
        });
    });

    it('should create a new form submission (sales rep)', () => {
      return request(app.getHttpServer())
        .post('/forms')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send({
          templateId,
          customerId,
          data: { test: 'data' },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.status).toBe('DRAFT');
          expect(res.body.templateId).toBe(templateId);
          expect(res.body.customerId).toBe(customerId);
        });
    });

    it('should not create form submission without authentication', () => {
      return request(app.getHttpServer())
        .post('/forms')
        .send({
          templateId,
          customerId,
          data: { test: 'data' },
        })
        .expect(401);
    });
  });

  describe('GET /forms', () => {
    beforeAll(() => {
      // Mock form submissions list response
      mockPrismaService.formSubmission.findMany.mockResolvedValue([
        {
          id: 'submission-1',
          templateId: 'template-1',
          userId: 'admin-1',
          customerId: 'customer-1',
          data: JSON.stringify({ test: 'data' }),
          status: 'DRAFT',
        },
      ]);
    });

    it('should get all form submissions (admin)', () => {
      return request(app.getHttpServer())
        .get('/forms')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get all form submissions (sales rep)', () => {
      return request(app.getHttpServer())
        .get('/forms')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should not get form submissions without authentication', () => {
      return request(app.getHttpServer())
        .get('/forms')
        .expect(401);
    });
  });

  describe('GET /forms/:id', () => {
    let submissionId: string;

    beforeAll(() => {
      // Mock form submission data
      const mockSubmission = {
        id: 'submission-1',
        templateId: 'template-1',
        userId: 'admin-1',
        customerId: 'customer-1',
        data: JSON.stringify({ test: 'data' }),
        status: 'DRAFT',
      };
      submissionId = mockSubmission.id;

      // Mock Prisma responses
      mockPrismaService.formSubmission.findUnique.mockResolvedValue(mockSubmission);
    });

    it('should get form submission by id (admin)', () => {
      return request(app.getHttpServer())
        .get(`/forms/${submissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(submissionId);
          expect(res.body.status).toBe('DRAFT');
        });
    });

    it('should get form submission by id (sales rep)', () => {
      return request(app.getHttpServer())
        .get(`/forms/${submissionId}`)
        .set('Authorization', `Bearer ${salesRepToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(submissionId);
          expect(res.body.status).toBe('DRAFT');
        });
    });

    it('should not get form submission without authentication', () => {
      return request(app.getHttpServer())
        .get(`/forms/${submissionId}`)
        .expect(401);
    });

    it('should return 404 for non-existent form submission', () => {
      mockPrismaService.formSubmission.findUnique.mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .get('/forms/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
}); 