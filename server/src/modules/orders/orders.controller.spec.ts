import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { UserRole } from '@prisma/client';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockCreateOrderDto: CreateOrderDto = {
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

    const mockOrder = {
      id: 'order-1',
      orderNumber: 'ORD2403300001',
      customerId: 'customer-1',
      salesRepId: 'sales-rep-1',
      status: OrderStatus.DRAFT,
      totalAmount: 200,
      items: [],
      customer: {},
      salesRep: {},
    };

    it('should create a new order', async () => {
      mockOrdersService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(mockCreateOrderDto);

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.create).toHaveBeenCalledWith(mockCreateOrderDto);
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
      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrdersService.findAll).toHaveBeenCalled();
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
      mockOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('order-1');

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith('order-1');
    });
  });

  describe('updateStatus', () => {
    const mockOrder = {
      id: 'order-1',
      orderNumber: 'ORD2403300001',
      status: OrderStatus.SHIPPED,
      items: [],
      customer: {},
      salesRep: {},
    };

    it('should update order status', async () => {
      mockOrdersService.updateStatus.mockResolvedValue(mockOrder);

      const result = await controller.updateStatus('order-1', {
        status: OrderStatus.SHIPPED,
      });

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(
        'order-1',
        OrderStatus.SHIPPED,
      );
    });
  });
}); 