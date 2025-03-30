import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '@prisma/client';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByManufacturer: jest.fn(),
    updatePrice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        manufacturerId: '1',
        description: 'Test Description',
        price: 99.99,
        qCode: 'TEST-001',
        nationalAsp: 89.99,
        mue: 'MUE-001',
      };

      const expectedResult = {
        id: '1',
        ...createProductDto,
        manufacturer: {
          id: '1',
          name: 'Test Manufacturer',
        },
      };

      mockProductsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const expectedProducts = [
        {
          id: '1',
          name: 'Product 1',
          manufacturer: {
            id: '1',
            name: 'Manufacturer 1',
          },
        },
        {
          id: '2',
          name: 'Product 2',
          manufacturer: {
            id: '2',
            name: 'Manufacturer 2',
          },
        },
      ];

      mockProductsService.findAll.mockResolvedValue(expectedProducts);

      const result = await controller.findAll();

      expect(result).toEqual(expectedProducts);
      expect(mockProductsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = '1';
      const expectedProduct = {
        id: productId,
        name: 'Test Product',
        manufacturer: {
          id: '1',
          name: 'Test Manufacturer',
        },
      };

      mockProductsService.findOne.mockResolvedValue(expectedProduct);

      const result = await controller.findOne(productId);

      expect(result).toEqual(expectedProduct);
      expect(mockProductsService.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = '1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 149.99,
      };

      const expectedResult = {
        id: productId,
        ...updateProductDto,
        manufacturer: {
          id: '1',
          name: 'Test Manufacturer',
        },
      };

      mockProductsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(productId, updateProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.update).toHaveBeenCalledWith(productId, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const productId = '1';
      const expectedResult = { message: 'Product deleted successfully' };

      mockProductsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(productId);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.remove).toHaveBeenCalledWith(productId);
    });
  });

  describe('findByManufacturer', () => {
    it('should return all products for a manufacturer', async () => {
      const manufacturerId = '1';
      const expectedProducts = [
        {
          id: '1',
          name: 'Product 1',
          manufacturer: {
            id: manufacturerId,
            name: 'Test Manufacturer',
          },
        },
      ];

      mockProductsService.findByManufacturer.mockResolvedValue(expectedProducts);

      const result = await controller.findByManufacturer(manufacturerId);

      expect(result).toEqual(expectedProducts);
      expect(mockProductsService.findByManufacturer).toHaveBeenCalledWith(manufacturerId);
    });
  });

  describe('updatePrice', () => {
    it('should update product price', async () => {
      const productId = '1';
      const newPrice = 199.99;

      const expectedProduct = {
        id: productId,
        name: 'Test Product',
        price: newPrice,
        manufacturer: {
          id: '1',
          name: 'Test Manufacturer',
        },
      };

      mockProductsService.updatePrice.mockResolvedValue(expectedProduct);

      const result = await controller.updatePrice(productId, newPrice);

      expect(result).toEqual(expectedProduct);
      expect(mockProductsService.updatePrice).toHaveBeenCalledWith(productId, newPrice);
    });
  });
}); 