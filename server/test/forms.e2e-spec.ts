import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { mockPrismaService, mockJwtService, createTestingModule } from './setup';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

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

  describe('POST /forms/templates', () => {
    it('should create a new form template (admin)', () => {
      const template = {
        name: 'Test Template',
        type: 'ORDER',
        schema: {
          fields: [
            {
              name: 'test',
              type: 'text',
              label: 'Test Field',
            },
          ],
        },
      };

      mockPrismaService.formTemplate.create.mockResolvedValue({
        id: 'template-1',
        ...template,
        schema: JSON.stringify(template.schema),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return request(app.getHttpServer())
        .post('/forms/templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(template)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'template-1');
          expect(res.body).toHaveProperty('name', template.name);
          expect(res.body).toHaveProperty('type', template.type);
          expect(res.body).toHaveProperty('schema');
        });
    });

    it('should not create a form template (sales rep)', () => {
      const template = {
        name: 'Test Template',
        type: 'ORDER',
        schema: {
          fields: [
            {
              name: 'test',
              type: 'text',
              label: 'Test Field',
            },
          ],
        },
      };

      return request(app.getHttpServer())
        .post('/forms/templates')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send(template)
        .expect(403);
    });

    it('should not create a form template (unauthorized)', () => {
      const template = {
        name: 'Test Template',
        type: 'ORDER',
        schema: {
          fields: [
            {
              name: 'test',
              type: 'text',
              label: 'Test Field',
            },
          ],
        },
      };

      return request(app.getHttpServer())
        .post('/forms/templates')
        .send(template)
        .expect(401);
    });
  });

  describe('GET /forms/templates', () => {
    it('should get all form templates', () => {
      const templates = [
        {
          id: 'template-1',
          name: 'Test Template 1',
          type: 'ORDER',
          schema: JSON.stringify({
            fields: [
              {
                name: 'test1',
                type: 'text',
                label: 'Test Field 1',
              },
            ],
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'template-2',
          name: 'Test Template 2',
          type: 'ORDER',
          schema: JSON.stringify({
            fields: [
              {
                name: 'test2',
                type: 'text',
                label: 'Test Field 2',
              },
            ],
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.formTemplate.findMany.mockResolvedValue(templates);

      return request(app.getHttpServer())
        .get('/forms/templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('id', 'template-1');
          expect(res.body[1]).toHaveProperty('id', 'template-2');
        });
    });

    it('should not get form templates (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/forms/templates')
        .expect(401);
    });
  });

  describe('GET /forms/templates/:id', () => {
    it('should get a form template by ID', () => {
      const template = {
        id: 'template-1',
        name: 'Test Template',
        type: 'ORDER',
        schema: JSON.stringify({
          fields: [
            {
              name: 'test',
              type: 'text',
              label: 'Test Field',
            },
          ],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.formTemplate.findUnique.mockResolvedValue(template);

      return request(app.getHttpServer())
        .get('/forms/templates/template-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'template-1');
          expect(res.body).toHaveProperty('name', template.name);
          expect(res.body).toHaveProperty('type', template.type);
          expect(res.body).toHaveProperty('schema');
        });
    });

    it('should not get a form template (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/forms/templates/template-1')
        .expect(401);
    });
  });

  describe('POST /forms/submissions', () => {
    it('should create a new form submission', () => {
      const submission = {
        templateId: 'template-1',
        customerId: 'customer-1',
        data: {
          test: 'value',
        },
      };

      mockPrismaService.formSubmission.create.mockResolvedValue({
        id: 'submission-1',
        ...submission,
        data: JSON.stringify(submission.data),
        status: 'DRAFT',
        userId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return request(app.getHttpServer())
        .post('/forms/submissions')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send(submission)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'submission-1');
          expect(res.body).toHaveProperty('templateId', submission.templateId);
          expect(res.body).toHaveProperty('customerId', submission.customerId);
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('status', 'DRAFT');
        });
    });

    it('should not create a form submission (unauthorized)', () => {
      const submission = {
        templateId: 'template-1',
        customerId: 'customer-1',
        data: {
          test: 'value',
        },
      };

      return request(app.getHttpServer())
        .post('/forms/submissions')
        .send(submission)
        .expect(401);
    });
  });

  describe('GET /forms/submissions', () => {
    it('should get all form submissions', () => {
      const submissions = [
        {
          id: 'submission-1',
          templateId: 'template-1',
          customerId: 'customer-1',
          data: JSON.stringify({
            test: 'value1',
          }),
          status: 'DRAFT',
          userId: 'sales-rep-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'submission-2',
          templateId: 'template-2',
          customerId: 'customer-2',
          data: JSON.stringify({
            test: 'value2',
          }),
          status: 'SUBMITTED',
          userId: 'sales-rep-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.formSubmission.findMany.mockResolvedValue(submissions);

      return request(app.getHttpServer())
        .get('/forms/submissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('id', 'submission-1');
          expect(res.body[1]).toHaveProperty('id', 'submission-2');
        });
    });

    it('should not get form submissions (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/forms/submissions')
        .expect(401);
    });
  });

  describe('GET /forms/submissions/:id', () => {
    it('should get a form submission by ID', () => {
      const submission = {
        id: 'submission-1',
        templateId: 'template-1',
        customerId: 'customer-1',
        data: JSON.stringify({
          test: 'value',
        }),
        status: 'DRAFT',
        userId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.formSubmission.findUnique.mockResolvedValue(submission);

      return request(app.getHttpServer())
        .get('/forms/submissions/submission-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'submission-1');
          expect(res.body).toHaveProperty('templateId', submission.templateId);
          expect(res.body).toHaveProperty('customerId', submission.customerId);
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('status', 'DRAFT');
        });
    });

    it('should not get a form submission (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/forms/submissions/submission-1')
        .expect(401);
    });
  });

  describe('PUT /forms/submissions/:id/status', () => {
    it('should update form submission status (admin)', () => {
      const submission = {
        id: 'submission-1',
        templateId: 'template-1',
        customerId: 'customer-1',
        data: JSON.stringify({
          test: 'value',
        }),
        status: 'APPROVED',
        userId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.formSubmission.update.mockResolvedValue(submission);

      return request(app.getHttpServer())
        .put('/forms/submissions/submission-1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'APPROVED' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'submission-1');
          expect(res.body).toHaveProperty('status', 'APPROVED');
        });
    });

    it('should not update form submission status (sales rep)', () => {
      return request(app.getHttpServer())
        .put('/forms/submissions/submission-1/status')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send({ status: 'APPROVED' })
        .expect(403);
    });

    it('should not update form submission status (unauthorized)', () => {
      return request(app.getHttpServer())
        .put('/forms/submissions/submission-1/status')
        .send({ status: 'APPROVED' })
        .expect(401);
    });
  });

  describe('GET /forms/submissions/:id/pdf', () => {
    it('should get PDF for a completed form submission', () => {
      const submission = {
        id: 'submission-1',
        templateId: 'template-1',
        customerId: 'customer-1',
        data: JSON.stringify({
          test: 'value',
        }),
        status: 'COMPLETED',
        userId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.formSubmission.findUnique.mockResolvedValue(submission);

      return request(app.getHttpServer())
        .get('/forms/submissions/submission-1/pdf')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', 'application/pdf');
    });

    it('should not get PDF for a form submission (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/forms/submissions/submission-1/pdf')
        .expect(401);
    });
  });
}); 