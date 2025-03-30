import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('Forms (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  let adminToken: string;
  let customerToken: string;
  let salesRepToken: string;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    role: UserRole.ADMIN,
  };

  const mockCustomer = {
    id: '2',
    email: 'customer@example.com',
    role: UserRole.CUSTOMER,
  };

  const mockSalesRep = {
    id: '3',
    email: 'salesrep@example.com',
    role: UserRole.SALES_REPRESENTATIVE,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    await app.init();

    // Create test users
    await prismaService.user.createMany({
      data: [mockUser, mockCustomer, mockSalesRep],
    });

    // Generate tokens
    const jwtSecret = configService.get<string>('JWT_SECRET');
    adminToken = jwtService.sign({ sub: mockUser.id, role: mockUser.role }, { secret: jwtSecret });
    customerToken = jwtService.sign({ sub: mockCustomer.id, role: mockCustomer.role }, { secret: jwtSecret });
    salesRepToken = jwtService.sign({ sub: mockSalesRep.id, role: mockSalesRep.role }, { secret: jwtSecret });
  });

  afterAll(async () => {
    await prismaService.formSubmission.deleteMany();
    await prismaService.formTemplate.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('Form Templates', () => {
    let templateId: string;

    it('should create a form template (Admin only)', () => {
      return request(app.getHttpServer())
        .post('/forms/templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          type: 'wound_assessment',
          title: 'Wound Assessment Form',
          description: 'Standard wound assessment form',
          schema: {
            fields: [
              {
                name: 'wound_location',
                type: 'text',
                label: 'Wound Location',
                required: true,
              },
              {
                name: 'wound_size',
                type: 'number',
                label: 'Wound Size (cm)',
                required: true,
              },
            ],
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.type).toBe('wound_assessment');
          templateId = res.body.id;
        });
    });

    it('should not allow non-admin users to create templates', () => {
      return request(app.getHttpServer())
        .post('/forms/templates')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          type: 'wound_assessment',
          title: 'Wound Assessment Form',
          description: 'Standard wound assessment form',
          schema: { fields: [] },
        })
        .expect(403);
    });

    it('should get all form templates', () => {
      return request(app.getHttpServer())
        .get('/forms/templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get a specific form template', () => {
      return request(app.getHttpServer())
        .get(`/forms/templates/${templateId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(templateId);
        });
    });
  });

  describe('Form Submissions', () => {
    let submissionId: string;
    let templateId: string;

    beforeEach(async () => {
      // Create a test template
      const template = await prismaService.formTemplate.create({
        data: {
          type: 'test_form',
          title: 'Test Form',
          description: 'Test form for submissions',
          schema: { fields: [] },
        },
      });
      templateId = template.id;
    });

    it('should create a form submission', () => {
      return request(app.getHttpServer())
        .post('/forms/submissions')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          templateId,
          customerId: mockCustomer.id,
          data: {
            field1: 'value1',
            field2: 'value2',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.status).toBe('PROCESSING');
          submissionId = res.body.id;
        });
    });

    it('should get all form submissions', () => {
      return request(app.getHttpServer())
        .get('/forms/submissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get a specific form submission', () => {
      return request(app.getHttpServer())
        .get(`/forms/submissions/${submissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(submissionId);
        });
    });

    it('should update submission status (Admin only)', () => {
      return request(app.getHttpServer())
        .patch(`/forms/submissions/${submissionId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'COMPLETED' })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('COMPLETED');
          expect(res.body.completedAt).toBeDefined();
        });
    });

    it('should not allow non-admin users to update submission status', () => {
      return request(app.getHttpServer())
        .patch(`/forms/submissions/${submissionId}/status`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ status: 'COMPLETED' })
        .expect(403);
    });

    it('should download PDF for completed submission', async () => {
      // First update the submission status to completed
      await request(app.getHttpServer())
        .patch(`/forms/submissions/${submissionId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'COMPLETED' });

      // Then try to download the PDF
      return request(app.getHttpServer())
        .get(`/forms/submissions/${submissionId}/pdf`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', 'application/pdf');
    });

    it('should not allow downloading PDF for non-completed submission', () => {
      // Create a new submission that's not completed
      return request(app.getHttpServer())
        .post('/forms/submissions')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          templateId,
          customerId: mockCustomer.id,
          data: { field1: 'value1' },
        })
        .expect(201)
        .then((res) => {
          const newSubmissionId = res.body.id;
          return request(app.getHttpServer())
            .get(`/forms/submissions/${newSubmissionId}/pdf`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(400)
            .expect((res) => {
              expect(res.body.message).toBe('Submission is not completed');
            });
        });
    });
  });
}); 