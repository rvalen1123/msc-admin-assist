import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockPrismaService, mockJwtService } from './setup';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { PrismaService } from '../src/prisma/prisma.service';

describe('FormsController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let salesRepToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Mock user data
    const mockUser = {
      id: 'user-1',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
    };

    const mockSalesRep = {
      id: 'sales-rep-1',
      email: 'sales@example.com',
      role: UserRole.SALES,
      firstName: 'Sales',
      lastName: 'Rep',
    };

    const mockCustomer = {
      id: 'customer-1',
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '1234567890',
      company: 'Test Company',
      addressLine1: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTemplate = {
      id: 'template-1',
      title: 'Test Template',
      type: 'WOUND_ASSESSMENT',
      schema: {
        fields: [
          {
            name: 'woundLocation',
            label: 'Wound Location',
            type: 'text',
            required: true,
          },
          {
            name: 'woundSize',
            label: 'Wound Size',
            type: 'number',
            required: true,
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockSubmission = {
      id: 'submission-1',
      templateId: 'template-1',
      userId: 'user-1',
      customerId: 'customer-1',
      data: JSON.stringify({
        woundLocation: 'Left leg',
        woundSize: 5,
      }),
      status: 'PENDING',
      createdAt: new Date(),
    };

    // Mock Prisma responses
    mockPrismaService.user.findUnique.mockImplementation(({ where }) => {
      if (where.id === 'user-1') return Promise.resolve(mockUser);
      if (where.id === 'sales-rep-1') return Promise.resolve(mockSalesRep);
      return Promise.resolve(null);
    });

    mockPrismaService.customer.findUnique.mockImplementation(({ where }) => {
      if (where.id === 'customer-1') return Promise.resolve(mockCustomer);
      return Promise.resolve(null);
    });

    mockPrismaService.formTemplate.create.mockImplementation(({ data }) => {
      return Promise.resolve({
        id: 'template-1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    mockPrismaService.formTemplate.findMany.mockResolvedValue([
      mockTemplate,
      {
        id: 'template-2',
        title: 'Another Template',
        type: 'WOUND_ASSESSMENT',
        schema: {
          fields: [
            {
              name: 'woundLocation',
              label: 'Wound Location',
              type: 'text',
              required: true,
            },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockPrismaService.formTemplate.findUnique.mockImplementation(({ where }) => {
      if (where.id === 'template-1') return Promise.resolve(mockTemplate);
      return Promise.resolve(null);
    });

    mockPrismaService.formSubmission.create.mockImplementation(({ data }) => {
      return Promise.resolve({
        ...mockSubmission,
        ...data,
      });
    });

    mockPrismaService.formSubmission.findMany.mockResolvedValue([
      mockSubmission,
      {
        id: 'submission-2',
        templateId: 'template-2',
        userId: 'user-1',
        customerId: 'customer-1',
        data: {
          woundLocation: 'Right arm',
        },
        status: 'APPROVED',
        createdAt: new Date(),
      },
    ]);

    mockPrismaService.formSubmission.findUnique.mockImplementation(({ where }) => {
      if (where.id === 'submission-1') return Promise.resolve(mockSubmission);
      return Promise.resolve(null);
    });

    mockPrismaService.formSubmission.update.mockImplementation(({ where, data }) => {
      if (where.id === 'submission-1') {
        return Promise.resolve({
          ...mockSubmission,
          ...data,
        });
      }
      return Promise.resolve(null);
    });

    // Get tokens using mocked JWT service
    adminToken = mockJwtService.sign({ sub: 'user-1', email: 'admin@example.com', role: UserRole.ADMIN });
    salesRepToken = mockJwtService.sign({ sub: 'sales-rep-1', email: 'sales@example.com', role: UserRole.SALES });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /forms/templates', () => {
    it('should create a new form template (admin)', () => {
      const template = {
        title: 'Test Template',
        type: 'WOUND_ASSESSMENT',
        schema: JSON.stringify({
          fields: [
            {
              name: 'woundLocation',
              label: 'Wound Location',
              type: 'text',
              required: true,
            },
            {
              name: 'woundSize',
              label: 'Wound Size',
              type: 'number',
              required: true,
            },
          ],
        }),
      };

      return request(app.getHttpServer())
        .post('/forms/templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(template)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'template-1');
          expect(res.body).toHaveProperty('title', template.title);
          expect(res.body).toHaveProperty('type', template.type);
          expect(res.body).toHaveProperty('schema', template.schema);
        });
    });
  });

  describe('GET /forms/templates', () => {
    it('should get all form templates', () => {
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
  });

  describe('GET /forms/templates/:id', () => {
    it('should get a form template by ID', () => {
      return request(app.getHttpServer())
        .get('/forms/templates/template-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'template-1');
          expect(res.body).toHaveProperty('title', 'Test Template');
          expect(res.body).toHaveProperty('type', 'WOUND_ASSESSMENT');
        });
    });
  });

  describe('POST /forms/submissions', () => {
    it('should create a new form submission', () => {
      const submission = {
        templateId: 'template-1',
        customerId: 'customer-1',
        data: {
          woundLocation: 'Left leg',
          woundSize: 5,
        },
      };

      return request(app.getHttpServer())
        .post('/forms/submissions')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send(submission)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'submission-1');
          expect(res.body).toHaveProperty('templateId', submission.templateId);
          expect(res.body).toHaveProperty('customerId', submission.customerId);
          expect(res.body).toHaveProperty('data', submission.data);
        });
    });
  });

  describe('GET /forms/submissions', () => {
    it('should get all form submissions', () => {
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
  });

  describe('GET /forms/submissions/:id', () => {
    it('should get a form submission by ID', () => {
      return request(app.getHttpServer())
        .get('/forms/submissions/submission-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'submission-1');
          expect(res.body).toHaveProperty('templateId', 'template-1');
          expect(res.body).toHaveProperty('customerId', 'customer-1');
        });
    });
  });

  describe('PUT /forms/submissions/:id/status', () => {
    it('should update form submission status (admin)', () => {
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
  });

  describe('GET /forms/submissions/:id/pdf', () => {
    it('should get PDF for a completed form submission', () => {
      return request(app.getHttpServer())
        .get('/forms/submissions/submission-1/pdf')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', 'application/pdf');
    });
  });
}); 