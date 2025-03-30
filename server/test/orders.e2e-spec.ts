import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { OrderStatus } from '../src/modules/orders/enums/order-status.enum';
import { UserRole } from '@prisma/client';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminToken: string;
  let salesRepToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Create test users and get tokens
    const adminResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123',
      });
    adminToken = adminResponse.body.access_token;

    const salesRepResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'salesrep@test.com',
        password: 'salesrep123',
      });
    salesRepToken = salesRepResponse.body.access_token;
  });

  afterAll(async () => {
    await prismaService.order.deleteMany();
    await prismaService.orderItem.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.customer.deleteMany();
    await prismaService.product.deleteMany();
    await app.close();
  });

  describe('POST /orders', () => {
    let customerId: string;
    let productId: string;

    beforeAll(async () => {
      // Create test customer
      const customer = await prismaService.customer.create({
        data: {
          name: 'Test Customer',
          email: 'customer@test.com',
          phone: '1234567890',
        },
      });
      customerId = customer.id;

      // Create test product
      const product = await prismaService.product.create({
        data: {
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          sku: 'TEST-SKU-001',
        },
      });
      productId = product.id;
    });

    it('should create a new order (admin)', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId,
          salesRepId: 'sales-rep-1', // This should be a valid sales rep ID
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
          salesRepId: 'sales-rep-1', // This should be a valid sales rep ID
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

    beforeAll(async () => {
      // Create a test order
      const order = await prismaService.order.create({
        data: {
          orderNumber: 'TEST-ORDER-001',
          customerId: 'customer-1', // This should be a valid customer ID
          salesRepId: 'sales-rep-1', // This should be a valid sales rep ID
          status: OrderStatus.DRAFT,
          totalAmount: 200,
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          notes: 'Test order',
        },
      });
      orderId = order.id;
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
      return request(app.getHttpServer())
        .get('/orders/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /orders/:id/status', () => {
    let orderId: string;

    beforeAll(async () => {
      // Create a test order
      const order = await prismaService.order.create({
        data: {
          orderNumber: 'TEST-ORDER-002',
          customerId: 'customer-1', // This should be a valid customer ID
          salesRepId: 'sales-rep-1', // This should be a valid sales rep ID
          status: OrderStatus.DRAFT,
          totalAmount: 200,
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          notes: 'Test order',
        },
      });
      orderId = order.id;
    });

    it('should update order status (admin)', () => {
      return request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: OrderStatus.SHIPPED })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(OrderStatus.SHIPPED);
          expect(res.body.shippedAt).toBeDefined();
        });
    });

    it('should not update order status (sales rep)', () => {
      return request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send({ status: OrderStatus.SHIPPED })
        .expect(403);
    });

    it('should not update order status without authentication', () => {
      return request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .send({ status: OrderStatus.SHIPPED })
        .expect(401);
    });

    it('should return 404 for non-existent order', () => {
      return request(app.getHttpServer())
        .patch('/orders/non-existent-id/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: OrderStatus.SHIPPED })
        .expect(404);
    });
  });
}); 