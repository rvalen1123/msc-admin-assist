import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockPrismaService, mockJwtService } from './setup';
import { OrderStatus } from '../src/modules/orders/enums/order-status.enum';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { PrismaService } from '../src/prisma/prisma.service';
import { ProductsService } from '../src/modules/products/products.service';
import { CustomersService } from '../src/modules/customers/customers.service';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let salesRepToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(ProductsService)
      .useValue({
        findOne: jest.fn().mockImplementation((id) => {
          if (id === 'product-1') {
            return Promise.resolve({
              id: 'product-1',
              name: 'Test Product',
              description: 'Test Description',
              price: 100,
              manufacturerId: 'manufacturer-1',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
          return Promise.resolve(null);
        }),
      })
      .overrideProvider(CustomersService)
      .useValue({
        findOne: jest.fn().mockImplementation((id) => {
          if (id === 'customer-1') {
            return Promise.resolve({
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
            });
          }
          return Promise.resolve(null);
        }),
      })
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

    const mockProduct = {
      id: 'product-1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      manufacturerId: 'manufacturer-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockOrder = {
      id: 'order-1',
      orderNumber: 'ORD-001',
      customerId: 'customer-1',
      salesRepId: 'sales-rep-1',
      status: OrderStatus.PENDING,
      totalAmount: 200,
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          unitPrice: 100,
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country',
      },
      billingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country',
      },
      notes: 'Test order notes',
      createdAt: new Date(),
      updatedAt: new Date(),
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

    mockPrismaService.product.findUnique.mockImplementation(({ where }) => {
      if (where.id === 'product-1') return Promise.resolve(mockProduct);
      return Promise.resolve(null);
    });

    mockPrismaService.order.create.mockImplementation(({ data }) => {
      return Promise.resolve({
        id: 'order-1',
        orderNumber: 'ORD-001',
        ...data,
        status: OrderStatus.PENDING,
        totalAmount: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    mockPrismaService.order.findMany.mockResolvedValue([
      mockOrder,
      {
        ...mockOrder,
        id: 'order-2',
        orderNumber: 'ORD-002',
        status: OrderStatus.CONFIRMED,
      },
    ]);

    mockPrismaService.order.findUnique.mockImplementation(({ where }) => {
      if (where.id === 'order-1') return Promise.resolve(mockOrder);
      return Promise.resolve(null);
    });

    mockPrismaService.order.update.mockImplementation(({ where, data }) => {
      if (where.id === 'order-1') {
        return Promise.resolve({
          ...mockOrder,
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

  describe('POST /orders', () => {
    it('should create a new order', () => {
      const order = {
        customerId: 'customer-1',
        salesRepId: 'sales-rep-1',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            unitPrice: 100,
          },
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country',
        },
        billingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country',
        },
        notes: 'Test order notes',
      };

      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send(order)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'order-1');
          expect(res.body).toHaveProperty('orderNumber', 'ORD-001');
          expect(res.body).toHaveProperty('customerId', order.customerId);
          expect(res.body).toHaveProperty('salesRepId', order.salesRepId);
          expect(res.body).toHaveProperty('status', OrderStatus.PENDING);
          expect(res.body).toHaveProperty('totalAmount', 200);
        });
    });
  });

  describe('GET /orders', () => {
    it('should get all orders', () => {
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
  });

  describe('GET /orders/:id', () => {
    it('should get an order by ID', () => {
      return request(app.getHttpServer())
        .get('/orders/order-1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'order-1');
          expect(res.body).toHaveProperty('customerId', 'customer-1');
          expect(res.body).toHaveProperty('salesRepId', 'sales-rep-1');
        });
    });
  });

  describe('PUT /orders/:id/status', () => {
    it('should update order status (admin)', () => {
      return request(app.getHttpServer())
        .put('/orders/order-1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: OrderStatus.CONFIRMED })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'order-1');
          expect(res.body).toHaveProperty('status', OrderStatus.CONFIRMED);
        });
    });

    it('should not update order status (sales rep)', () => {
      return request(app.getHttpServer())
        .put('/orders/order-1/status')
        .set('Authorization', `Bearer ${salesRepToken}`)
        .send({ status: OrderStatus.CONFIRMED })
        .expect(403);
    });

    it('should not update order status (unauthorized)', () => {
      return request(app.getHttpServer())
        .put('/orders/order-1/status')
        .send({ status: OrderStatus.CONFIRMED })
        .expect(401);
    });
  });

  describe('GET /orders/:id/pdf', () => {
    it('should get PDF for a completed order', () => {
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