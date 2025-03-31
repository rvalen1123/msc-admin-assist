import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserRole } from '../../modules/users/enums/user-role.enum';
import { TestHelper } from '../../common/testing/test-helper';
import { mockCustomersService } from '../../common/testing/mock-services';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([
      CustomersController,
    ]);

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    TestHelper.resetAllMocks();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890',
        company: 'Test Company',
        addressLine1: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country',
        contacts: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            isPrimary: true,
          },
        ],
      };

      const expectedResult = {
        id: 'customer-1',
        ...createCustomerDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCustomersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCustomerDto);

      expect(result).toEqual(expectedResult);
      expect(mockCustomersService.create).toHaveBeenCalledWith(createCustomerDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const expectedResult = [
        {
          id: 'customer-1',
          name: 'Test Customer',
          email: 'test@example.com',
        },
      ];

      mockCustomersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockCustomersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single customer', async () => {
      const customerId = 'customer-1';
      const expectedResult = {
        id: customerId,
        name: 'Test Customer',
        email: 'test@example.com',
      };

      mockCustomersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(customerId);

      expect(result).toEqual(expectedResult);
      expect(mockCustomersService.findOne).toHaveBeenCalledWith(customerId);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customerId = 'customer-1';
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Updated Customer',
        phone: '9876543210',
      };

      const expectedResult = {
        id: customerId,
        name: 'Updated Customer',
        email: 'test@example.com',
        phone: '9876543210',
      };

      mockCustomersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(customerId, updateCustomerDto);

      expect(result).toEqual(expectedResult);
      expect(mockCustomersService.update).toHaveBeenCalledWith(customerId, updateCustomerDto);
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const customerId = 'customer-1';
      mockCustomersService.remove.mockResolvedValue({ message: 'Customer deleted successfully' });

      const result = await controller.remove(customerId);

      expect(result).toEqual({ message: 'Customer deleted successfully' });
      expect(mockCustomersService.remove).toHaveBeenCalledWith(customerId);
    });
  });

  describe('findCustomerContacts', () => {
    it('should return customer contacts', async () => {
      const customerId = 'customer-1';
      const expectedContacts = [
        {
          id: 'contact-1',
          customerId,
          name: 'John Doe',
          email: 'john@example.com',
          isPrimary: true,
        },
      ];

      mockCustomersService.findCustomerContacts.mockResolvedValue(expectedContacts);

      const result = await controller.findCustomerContacts(customerId);

      expect(result).toEqual(expectedContacts);
      expect(mockCustomersService.findCustomerContacts).toHaveBeenCalledWith(customerId);
    });
  });
}); 