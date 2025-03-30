import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { contacts, ...customerData } = createCustomerDto;
    
    return this.prisma.customer.create({
      data: {
        ...customerData,
        contacts: {
          create: contacts || [],
        },
      },
      include: {
        contacts: true,
      },
    });
  }

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        contacts: true,
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        contacts: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const { contacts, ...customerData } = updateCustomerDto;

    try {
      const customer = await this.prisma.customer.update({
        where: { id },
        data: {
          ...customerData,
          contacts: contacts ? {
            deleteMany: {},
            create: contacts,
          } : undefined,
        },
        include: {
          contacts: true,
        },
      });

      return customer;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.customer.delete({
        where: { id },
      });
      return { message: 'Customer deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findCustomerContacts(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        contacts: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer.contacts;
  }
} 