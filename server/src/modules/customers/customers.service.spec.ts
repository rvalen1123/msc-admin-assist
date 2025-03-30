import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer with contacts', async () => {
      const createCustomerDto = {
        name: 'Test Customer',
        email: 'test@example.com',
        contacts: [
          {
            name: 'John Doe',
            email: 'john@example.com',
          },
        ],
      };

      const expectedResult = {
        id: '1',
        ...createCustomerDto,
        contacts: createCustomerDto.contacts.map(contact => ({
          id: '1',
          ...contact,
        })),
      };

      mockPrismaService.customer.create.mockResolvedValue(expectedResult);

      const result = await service.create(createCustomerDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.customer.create).toHaveBeenCalledWith({
        data: {
          name: createCustomerDto.name,
          email: createCustomerDto.email,
          contacts: {
            create: createCustomerDto.contacts,
          },
        },
        include: {
          contacts: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all customers with their contacts', async () => {
      const expectedCustomers = [
        {
          id: '1',
          name: 'Customer 1',
          contacts: [],
        },
        {
          id: '2',
          name: 'Customer 2',
          contacts: [],
        },
      ];

      mockPrismaService.customer.findMany.mockResolvedValue(expectedCustomers);

      const result = await service.findAll();

      expect(result).toEqual(expectedCustomers);
      expect(mockPrismaService.customer.findMany).toHaveBeenCalledWith({
        include: {
          contacts: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const customerId = '1';
      const expectedCustomer = {
        id: customerId,
        name: 'Test Customer',
        contacts: [],
      };

      mockPrismaService.customer.findUnique.mockResolvedValue(expectedCustomer);

      const result = await service.findOne(customerId);

      expect(result).toEqual(expectedCustomer);
      expect(mockPrismaService.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerId },
        include: {
          contacts: true,
        },
      });
    });

    it('should throw NotFoundException when customer is not found', async () => {
      const customerId = '1';
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.findOne(customerId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customerId = '1';
      const updateCustomerDto = {
        name: 'Updated Customer',
        contacts: [
          {
            name: 'Jane Doe',
            email: 'jane@example.com',
          },
        ],
      };

      const expectedResult = {
        id: customerId,
        ...updateCustomerDto,
        contacts: updateCustomerDto.contacts.map(contact => ({
          id: '1',
          ...contact,
        })),
      };

      mockPrismaService.customer.update.mockResolvedValue(expectedResult);

      const result = await service.update(customerId, updateCustomerDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.customer.update).toHaveBeenCalledWith({
        where: { id: customerId },
        data: {
          name: updateCustomerDto.name,
          contacts: {
            deleteMany: {},
            create: updateCustomerDto.contacts,
          },
        },
        include: {
          contacts: true,
        },
      });
    });

    it('should throw NotFoundException when updating non-existent customer', async () => {
      const customerId = '1';
      const updateCustomerDto = {
        name: 'Updated Customer',
      };

      mockPrismaService.customer.update.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.update(customerId, updateCustomerDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      const customerId = '1';
      mockPrismaService.customer.delete.mockResolvedValue({ id: customerId });

      const result = await service.remove(customerId);

      expect(result).toEqual({ message: 'Customer deleted successfully' });
      expect(mockPrismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: customerId },
      });
    });

    it('should throw NotFoundException when deleting non-existent customer', async () => {
      const customerId = '1';
      mockPrismaService.customer.delete.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.remove(customerId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCustomerContacts', () => {
    it('should return all contacts for a customer', async () => {
      const customerId = '1';
      const expectedContacts = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      ];

      mockPrismaService.customer.findUnique.mockResolvedValue({
        id: customerId,
        contacts: expectedContacts,
      });

      const result = await service.findCustomerContacts(customerId);

      expect(result).toEqual(expectedContacts);
      expect(mockPrismaService.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerId },
        include: {
          contacts: true,
        },
      });
    });

    it('should throw NotFoundException when customer is not found', async () => {
      const customerId = '1';
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.findCustomerContacts(customerId)).rejects.toThrow(NotFoundException);
    });
  });
}); 