import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    this.logger.log(`Creating new order for customer ${createOrderDto.customerId}`);

    // Validate customer exists
    const customer = await this.customersService.findOne(createOrderDto.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${createOrderDto.customerId} not found`);
    }

    // Validate sales rep exists
    const salesRep = await this.prisma.user.findUnique({
      where: { id: createOrderDto.salesRepId },
    });
    if (!salesRep) {
      throw new NotFoundException(`Sales representative with ID ${createOrderDto.salesRepId} not found`);
    }

    // Calculate order total and validate products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const itemTotal = item.quantity * item.unitPrice;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: itemTotal,
      });
    }

    // Generate unique order number
    const orderNumber = await this.generateOrderNumber();

    // Create order with items in a transaction
    return this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: createOrderDto.customerId,
          salesRepId: createOrderDto.salesRepId,
          status: OrderStatus.DRAFT,
          totalAmount,
          shippingAddress: createOrderDto.shippingAddress,
          billingAddress: createOrderDto.billingAddress,
          notes: createOrderDto.notes,
          items: {
            create: orderItems,
          },
        },
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

      this.logger.log(`Created order ${order.orderNumber}`);
      return order;
    });
  }

  async findAll() {
    this.logger.log('Fetching all orders');
    return this.prisma.order.findMany({
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
  }

  async findOne(id: string) {
    this.logger.log(`Fetching order with ID ${id}`);
    const order = await this.prisma.order.findUnique({
      where: { id },
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

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    this.logger.log(`Updating order ${id} status to ${status}`);
    const order = await this.findOne(id);

    const updateData: any = { status };
    
    // Update relevant timestamp based on status
    switch (status) {
      case OrderStatus.SHIPPED:
        updateData.shippedAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        updateData.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        updateData.cancelledAt = new Date();
        break;
      case OrderStatus.REFUNDED:
        updateData.refundedAt = new Date();
        break;
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
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
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the last order number for today
    const lastOrder = await this.prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `ORD${year}${month}${day}`,
        },
      },
      orderBy: {
        orderNumber: 'desc',
      },
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
} 