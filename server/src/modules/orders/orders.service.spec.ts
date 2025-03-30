import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
import { OrderStatus } from './enums/order-status.enum';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;
  let productsService: ProductsService;
  let customersService: CustomersService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  const mockCustomersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    productsService = module.get<ProductsService>(ProductsService);
    customersService = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockCreateOrderDto = {
      customerId: 'customer-1',
      salesRepId: 'sales-rep-1',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          unitPrice: 100,
        },
      ],
      shippingAddress: '123 Main St',
      billingAddress: '123 Main St',
      notes: 'Test order',
    };

    const mockCustomer = { id: 'customer-1', name: 'Test Customer' };
    const mockSalesRep = { id: 'sales-rep-1', name: 'Test Sales Rep' };
    const mockProduct = { id: 'product-1', name: 'Test Product', price: 100 };
    const mockOrder = {
      id: 'order-1',
      orderNumber: 'ORD2403300001',
      customerId: 'customer-1',
      salesRepId: 'sales-rep-1',
      status: OrderStatus.DRAFT,
      totalAmount: 200,
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          unitPrice: 100,
          totalPrice: 200,
          product: mockProduct,
        },
      ],
      customer: mockCustomer,
      salesRep: mockSalesRep,
    };

    it('should create a new order successfully', async () => {
      mockCustomersService.findOne.mockResolvedValue(mockCustomer);
      mockPrismaService.user.findUnique.mockResolvedValue(mockSalesRep);
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockPrismaService.order.findFirst.mockResolvedValue(null);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.create(mockCreateOrderDto);

      expect(result).toEqual(mockOrder);
      expect(mockCustomersService.findOne).toHaveBeenCalledWith('customer-1');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'sales-rep-1' },
      });
      expect(mockProductsService.findOne).toHaveBeenCalledWith('product-1');
      expect(mockPrismaService.order.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when customer not found', async () => {
      mockCustomersService.findOne.mockResolvedValue(null);

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when sales rep not found', async () => {
      mockCustomersService.findOne.mockResolvedValue(mockCustomer);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      mockCustomersService.findOne.mockResolvedValue(mockCustomer);
      mockPrismaService.user.findUnique.mockResolvedValue(mockSalesRep);
      mockProductsService.findOne.mockResolvedValue(null);

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    const mockOrders = [
      {
        id: 'order-1',
        orderNumber: 'ORD2403300001',
        items: [],
        customer: {},
        salesRep: {},
      },
    ];

    it('should return all orders', async () => {
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
          salesRep: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    const mockOrder = {
      id: 'order-1',
      orderNumber: 'ORD2403300001',
      items: [],
      customer: {},
      salesRep: {},
    };

    it('should return an order by id', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne('order-1');

      expect(result).toEqual(mockOrder);
      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
          salesRep: true,
        },
      });
    });

    it('should throw NotFoundException when order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne('order-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    const mockOrder = {
      id: 'order-1',
      orderNumber: 'ORD2403300001',
      status: OrderStatus.DRAFT,
      items: [],
      customer: {},
      salesRep: {},
    };

    it('should update order status successfully', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.SHIPPED,
        shippedAt: expect.any(Date),
      });

      const result = await service.updateStatus('order-1', OrderStatus.SHIPPED);

      expect(result.status).toBe(OrderStatus.SHIPPED);
      expect(result.shippedAt).toBeDefined();
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: expect.objectContaining({
          status: OrderStatus.SHIPPED,
          shippedAt: expect.any(Date),
        }),
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
          salesRep: true,
        },
      });
    });

    it('should throw NotFoundException when order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('order-1', OrderStatus.SHIPPED),
      ).rejects.toThrow(NotFoundException);
    });
  });
}); 