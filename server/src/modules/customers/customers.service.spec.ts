import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { CustomersModule } from './customers.module';
import { NotFoundException } from '@nestjs/common';
import { createTestingModule, mockPrismaService } from '../../test/setup';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(CustomersModule);
    service = module.get<CustomersService>(CustomersService);
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
            isPrimary: true,
          },
        ],
      };

      const expectedCustomer = {
        id: '1',
        ...createCustomerDto,
        contacts: createCustomerDto.contacts.map(contact => ({
          id: '1',
          customerId: '1',
          ...contact,
        })),
      };

      mockPrismaService.customer.create.mockResolvedValue(expectedCustomer);

      const result = await service.create(createCustomerDto);

      expect(result).toEqual(expectedCustomer);
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
          email: 'customer1@example.com',
          contacts: [
            {
              id: '1',
              customerId: '1',
              name: 'Contact 1',
              email: 'contact1@example.com',
            },
          ],
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
        email: 'test@example.com',
        contacts: [
          {
            id: '1',
            customerId: '1',
            name: 'Contact 1',
            email: 'contact1@example.com',
          },
        ],
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
        email: 'updated@example.com',
      };

      const expectedCustomer = {
        id: customerId,
        ...updateCustomerDto,
        contacts: [],
      };

      mockPrismaService.customer.update.mockResolvedValue(expectedCustomer);

      const result = await service.update(customerId, updateCustomerDto);

      expect(result).toEqual(expectedCustomer);
      expect(mockPrismaService.customer.update).toHaveBeenCalledWith({
        where: { id: customerId },
        data: updateCustomerDto,
        include: {
          contacts: true,
        },
      });
    });

    it('should throw NotFoundException when updating non-existent customer', async () => {
      const customerId = '1';
      const updateCustomerDto = {
        name: 'Updated Customer',
        email: 'updated@example.com',
      };

      mockPrismaService.customer.update.mockRejectedValue(new Error('Record not found'));

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
      mockPrismaService.customer.delete.mockRejectedValue(new Error('Record not found'));

      await expect(service.remove(customerId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCustomerContacts', () => {
    it('should return all contacts for a customer', async () => {
      const customerId = '1';
      const expectedContacts = [
        {
          id: '1',
          customerId: '1',
          name: 'Contact 1',
          email: 'contact1@example.com',
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