import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserRole } from '../../modules/users/enums/user-role.enum';
import { OrderStatus } from './enums/order-status.enum';
import { NotFoundException } from '@nestjs/common';
import { TestHelper } from '../../common/testing/test-helper';
import { mockOrdersService } from '../../common/testing/mock-services';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([
      OrdersController,
    ]);

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    TestHelper.resetAllMocks();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-1',
        salesRepId: 'sales-rep-1',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            unitPrice: 100,
          },
        ],
        shippingAddress: '123 Test St',
        billingAddress: '123 Test St',
        notes: 'Test order',
      };

      const expectedResult = {
        id: 'order-1',
        orderNumber: 'ORD-001',
        ...createOrderDto,
        status: OrderStatus.PENDING,
        totalAmount: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrdersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(result).toEqual(expectedResult);
      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const expectedOrders = [
        {
          id: 'order-1',
          orderNumber: 'ORD-001',
          status: OrderStatus.PENDING,
        },
        {
          id: 'order-2',
          orderNumber: 'ORD-002',
          status: OrderStatus.CONFIRMED,
        },
      ];

      mockOrdersService.findAll.mockResolvedValue(expectedOrders);

      const result = await controller.findAll();

      expect(result).toEqual(expectedOrders);
      expect(mockOrdersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const orderId = 'order-1';
      const expectedOrder = {
        id: orderId,
        orderNumber: 'ORD-001',
        status: OrderStatus.PENDING,
      };

      mockOrdersService.findOne.mockResolvedValue(expectedOrder);

      const result = await controller.findOne(orderId);

      expect(result).toEqual(expectedOrder);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith(orderId);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = 'not-found';

      mockOrdersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(orderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update an order status', async () => {
      const orderId = 'order-1';
      const newStatus = OrderStatus.SHIPPED;
      
      const expectedOrder = {
        id: orderId,
        orderNumber: 'ORD-001',
        status: newStatus,
        shippedAt: new Date(),
      };

      mockOrdersService.updateStatus.mockResolvedValue(expectedOrder);

      const result = await controller.updateStatus(orderId, newStatus);

      expect(result).toEqual(expectedOrder);
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(orderId, newStatus);
    });
  });
}); 