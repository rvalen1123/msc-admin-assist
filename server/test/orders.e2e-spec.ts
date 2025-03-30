import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { OrderStatus } from '../src/modules/orders/enums/order-status.enum';
import { mockPrismaService, mockJwtService, createTestingModule } from './setup';

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
    let customerId: string;
    let productId: string;

    beforeAll(async () => {
      // Mock customer and product data
      const mockCustomer = {
        id: 'customer-1',
        name: 'Test Customer',
        email: 'customer@test.com',
        phone: '1234567890',
      };

      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        sku: 'TEST-SKU-001',
      };

      customerId = mockCustomer.id;
      productId = mockProduct.id;

      // Mock Prisma responses
      mockPrismaService.customer.create.mockResolvedValue(mockCustomer);
      mockPrismaService.product.create.mockResolvedValue(mockProduct);
      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-1',
        orderNumber: 'TEST-ORDER-001',
        customerId: mockCustomer.id,
        salesRepId: 'sales-rep-1',
        status: OrderStatus.DRAFT,
        totalAmount: 200,
        shippingAddress: '123 Main St',
        billingAddress: '123 Main St',
        notes: 'Test order',
        items: [
          {
            id: 'order-item-1',
            orderId: 'order-1',
            productId: mockProduct.id,
            quantity: 2,
            unitPrice: 100,
            totalPrice: 200,
          },
        ],
      });
    });

    it('should create a new order (admin)', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId,
          salesRepId: 'sales-rep-1',
          items: [
            {
              productId,
              quantity: 2,
              unitPrice: 100,
            },
          ],
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          notes: 'Test order',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('orderNumber');
          expect(res.body.status).toBe(OrderStatus.DRAFT);
          expect(res.body.totalAmount).toBe(200);
          expect(res.body.items).toHaveLength(1);
        });
    });

    it('should create a new order (sales rep)', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send({
          customerId,
          salesRepId: 'sales-rep-1',
          items: [
            {
              productId,
              quantity: 2,
              unitPrice: 100,
            },
          ],
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          notes: 'Test order',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('orderNumber');
          expect(res.body.status).toBe(OrderStatus.DRAFT);
          expect(res.body.totalAmount).toBe(200);
          expect(res.body.items).toHaveLength(1);
        });
    });

    it('should not create order without authentication', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          customerId,
          salesRepId: 'sales-rep-1',
          items: [
            {
              productId,
              quantity: 2,
              unitPrice: 100,
            },
          ],
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          notes: 'Test order',
        })
        .expect(401);
    });
  });

  describe('GET /orders', () => {
    beforeAll(() => {
      // Mock order list response
      mockPrismaService.order.findMany.mockResolvedValue([
        {
          id: 'order-1',
          orderNumber: 'TEST-ORDER-001',
          customerId: 'customer-1',
          salesRepId: 'sales-rep-1',
          status: OrderStatus.DRAFT,
          totalAmount: 200,
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          notes: 'Test order',
        },
      ]);
    });

    it('should get all orders (admin)', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get all orders (sales rep)', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should not get orders without authentication', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect(401);
    });
  });

  describe('GET /orders/:id', () => {
    let orderId: string;

    beforeAll(() => {
      // Mock order data
      const mockOrder = {
        id: 'order-1',
        orderNumber: 'TEST-ORDER-001',
        customerId: 'customer-1',
        salesRepId: 'sales-rep-1',
        status: OrderStatus.DRAFT,
        totalAmount: 200,
        shippingAddress: '123 Main St',
        billingAddress: '123 Main St',
        notes: 'Test order',
      };
      orderId = mockOrder.id;

      // Mock Prisma responses
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
    });

    it('should get order by id (admin)', () => {
      return request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(orderId);
          expect(res.body.orderNumber).toBe('TEST-ORDER-001');
        });
    });

    it('should get order by id (sales rep)', () => {
      return request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${salesRepToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(orderId);
          expect(res.body.orderNumber).toBe('TEST-ORDER-001');
        });
    });

    it('should not get order without authentication', () => {
      return request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(401);
    });

    it('should return 404 for non-existent order', () => {
      mockPrismaService.order.findUnique.mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .get('/orders/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
}); 