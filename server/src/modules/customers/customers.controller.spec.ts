import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserRole } from '@prisma/client';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockCustomersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findCustomerContacts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
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

      mockCustomersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCustomerDto);

      expect(result).toEqual(expectedResult);
      expect(mockCustomersService.create).toHaveBeenCalledWith(createCustomerDto);
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
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

      mockCustomersService.findAll.mockResolvedValue(expectedCustomers);

      const result = await controller.findAll();

      expect(result).toEqual(expectedCustomers);
      expect(mockCustomersService.findAll).toHaveBeenCalled();
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

      mockCustomersService.findOne.mockResolvedValue(expectedCustomer);

      const result = await controller.findOne(customerId);

      expect(result).toEqual(expectedCustomer);
      expect(mockCustomersService.findOne).toHaveBeenCalledWith(customerId);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customerId = '1';
      const updateCustomerDto: UpdateCustomerDto = {
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

      mockCustomersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(customerId, updateCustomerDto);

      expect(result).toEqual(expectedResult);
      expect(mockCustomersService.update).toHaveBeenCalledWith(customerId, updateCustomerDto);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      const customerId = '1';
      const expectedResult = { message: 'Customer deleted successfully' };

      mockCustomersService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(customerId);

      expect(result).toEqual(expectedResult);
      expect(mockCustomersService.remove).toHaveBeenCalledWith(customerId);
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

      mockCustomersService.findCustomerContacts.mockResolvedValue(expectedContacts);

      const result = await controller.findCustomerContacts(customerId);

      expect(result).toEqual(expectedContacts);
      expect(mockCustomersService.findCustomerContacts).toHaveBeenCalledWith(customerId);
    });
  });
}); 