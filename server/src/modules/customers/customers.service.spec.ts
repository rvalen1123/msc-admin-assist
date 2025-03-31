import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { NotFoundException } from '@nestjs/common';
import { TestHelper } from '../../common/testing/test-helper';
import { mockPrismaService } from '../../common/testing/mock-services';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([
      CustomersService,
    ]);
    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    TestHelper.resetAllMocks();
  });

  describe('create', () => {
    it('should create a customer with contacts', async () => {
      const customerId = 'customer-uuid-1';
      const contactId = 'contact-uuid-1';
      const timestamp = new Date();

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

      // Mock the response with UUID and all fields that will be returned
      const expectedCustomer = {
        id: customerId,
        name: 'Test Customer',
        email: 'test@example.com',
        phone: null,
        company: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        zipCode: null,
        country: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        contacts: [
          {
            id: contactId,
            customerId,
            name: 'John Doe',
            email: 'john@example.com',
            isPrimary: true,
            phone: null,
            title: null,
            createdAt: timestamp,
          }
        ],
      };

      // Mock the database create response
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
      const customerId = 'customer-uuid-1';
      const contactId = 'contact-uuid-1';
      const timestamp = new Date();

      const expectedCustomers = [
        {
          id: customerId,
          name: 'Test Customer',
          email: 'test@example.com',
          phone: null,
          company: null,
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          zipCode: null,
          country: null,
          createdAt: timestamp,
          updatedAt: timestamp,
          contacts: [
            {
              id: contactId,
              customerId,
              name: 'John Doe',
              email: 'john@example.com',
              isPrimary: true,
              phone: null,
              title: null,
              createdAt: timestamp,
            }
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
      const customerId = 'customer-uuid-1';
      const contactId = 'contact-uuid-1';
      const timestamp = new Date();

      const expectedCustomer = {
        id: customerId,
        name: 'Test Customer',
        email: 'test@example.com',
        phone: null,
        company: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        zipCode: null,
        country: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        contacts: [
          {
            id: contactId,
            customerId,
            name: 'John Doe',
            email: 'john@example.com',
            isPrimary: true,
            phone: null,
            title: null,
            createdAt: timestamp,
          }
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
      const customerId = 'non-existent-id';
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.findOne(customerId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customerId = 'customer-uuid-1';
      const timestamp = new Date();

      const updateCustomerDto = {
        name: 'Updated Customer',
        email: 'updated@example.com',
      };

      const expectedCustomer = {
        id: customerId,
        name: 'Updated Customer',
        email: 'updated@example.com',
        phone: null,
        company: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        zipCode: null,
        country: null,
        createdAt: timestamp,
        updatedAt: timestamp,
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
      const customerId = 'non-existent-id';
      const updateCustomerDto = {
        name: 'Updated Customer',
        email: 'updated@example.com',
      };

      const prismaError = new Error('Record to update not found');
      // Add the P2025 code which is Prisma's "Record not found" error code
      prismaError['code'] = 'P2025';
      mockPrismaService.customer.update.mockRejectedValue(prismaError);

      await expect(service.update(customerId, updateCustomerDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      const customerId = 'customer-uuid-1';
      mockPrismaService.customer.delete.mockResolvedValue({ id: customerId });

      const result = await service.remove(customerId);

      expect(result).toEqual({ message: 'Customer deleted successfully' });
      expect(mockPrismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: customerId },
      });
    });

    it('should throw NotFoundException when deleting non-existent customer', async () => {
      const customerId = 'non-existent-id';
      const prismaError = new Error('Record to delete not found');
      // Add the P2025 code which is Prisma's "Record not found" error code
      prismaError['code'] = 'P2025';
      mockPrismaService.customer.delete.mockRejectedValue(prismaError);

      await expect(service.remove(customerId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCustomerContacts', () => {
    it('should return all contacts for a customer', async () => {
      const customerId = 'customer-uuid-1';
      const contactId = 'contact-uuid-1';
      const timestamp = new Date();

      const expectedContacts = [
        {
          id: contactId,
          customerId,
          name: 'John Doe',
          email: 'john@example.com',
          isPrimary: true,
          phone: null,
          title: null,
          createdAt: timestamp,
        }
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
      const customerId = 'non-existent-id';
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.findCustomerContacts(customerId)).rejects.toThrow(NotFoundException);
    });
  });
}); 