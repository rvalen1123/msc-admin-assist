import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { OrderStatus } from '../src/modules/orders/enums/order-status.enum';
import { mockPrismaService, mockJwtService, createTestingModule } from './setup';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

describe('OrdersController (e2e)', () => {
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

  describe('POST /orders', () => {
    it('should create a new order', () => {
      const order = {
        customerId: 'customer-1',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            price: 100,
          },
        ],
      };

      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-1',
        ...order,
        status: OrderStatus.PENDING,
        salesRepId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send(order)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'order-1');
          expect(res.body).toHaveProperty('customerId', order.customerId);
          expect(res.body).toHaveProperty('status', OrderStatus.PENDING);
          expect(res.body).toHaveProperty('salesRepId', 'sales-rep-1');
        });
    });

    it('should not create an order (unauthorized)', () => {
      const order = {
        customerId: 'customer-1',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            price: 100,
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/orders')
        .send(order)
        .expect(401);
    });
  });

  describe('GET /orders', () => {
    it('should get all orders', () => {
      const orders = [
        {
          id: 'order-1',
          customerId: 'customer-1',
          status: OrderStatus.PENDING,
          salesRepId: 'sales-rep-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'order-2',
          customerId: 'customer-2',
          status: OrderStatus.APPROVED,
          salesRepId: 'sales-rep-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(orders);

      return request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('id', 'order-1');
          expect(res.body[1]).toHaveProperty('id', 'order-2');
        });
    });

    it('should not get orders (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect(401);
    });
  });

  describe('GET /orders/:id', () => {
    it('should get an order by ID', () => {
      const order = {
        id: 'order-1',
        customerId: 'customer-1',
        status: OrderStatus.PENDING,
        salesRepId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.order.findUnique.mockResolvedValue(order);

      return request(app.getHttpServer())
        .get('/orders/order-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'order-1');
          expect(res.body).toHaveProperty('customerId', order.customerId);
          expect(res.body).toHaveProperty('status', OrderStatus.PENDING);
          expect(res.body).toHaveProperty('salesRepId', 'sales-rep-1');
        });
    });

    it('should not get an order (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/orders/order-1')
        .expect(401);
    });
  });

  describe('PUT /orders/:id/status', () => {
    it('should update order status (admin)', () => {
      const order = {
        id: 'order-1',
        customerId: 'customer-1',
        status: OrderStatus.APPROVED,
        salesRepId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.order.update.mockResolvedValue(order);

      return request(app.getHttpServer())
        .put('/orders/order-1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: OrderStatus.APPROVED })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'order-1');
          expect(res.body).toHaveProperty('status', OrderStatus.APPROVED);
        });
    });

    it('should not update order status (sales rep)', () => {
      return request(app.getHttpServer())
        .put('/orders/order-1/status')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send({ status: OrderStatus.APPROVED })
        .expect(403);
    });

    it('should not update order status (unauthorized)', () => {
      return request(app.getHttpServer())
        .put('/orders/order-1/status')
        .send({ status: OrderStatus.APPROVED })
        .expect(401);
    });
  });

  describe('GET /orders/:id/pdf', () => {
    it('should get PDF for a completed order', () => {
      const order = {
        id: 'order-1',
        customerId: 'customer-1',
        status: OrderStatus.COMPLETED,
        salesRepId: 'sales-rep-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.order.findUnique.mockResolvedValue(order);

      return request(app.getHttpServer())
        .get('/orders/order-1/pdf')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', 'application/pdf');
    });

    it('should not get PDF for an order (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/orders/order-1/pdf')
        .expect(401);
    });
  });
}); 