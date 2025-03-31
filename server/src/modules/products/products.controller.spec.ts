import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '../../modules/users/enums/user-role.enum';
import { TestHelper } from '../../common/testing/test-helper';
import { mockProductsService } from '../../common/testing/mock-services';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([
      ProductsController,
    ]);

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    TestHelper.resetAllMocks();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        manufacturerId: 'manufacturer-1',
      };

      const expectedResult = {
        id: 'product-1',
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedResult = [
        {
          id: 'product-1',
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          manufacturerId: 'manufacturer-1',
        },
      ];

      mockProductsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const productId = 'product-1';
      const expectedResult = {
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        manufacturerId: 'manufacturer-1',
      };

      mockProductsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(productId);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = 'product-1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };

      const expectedResult = {
        id: productId,
        name: 'Updated Product',
        description: 'Test Description',
        price: 150,
        manufacturerId: 'manufacturer-1',
      };

      mockProductsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(productId, updateProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.update).toHaveBeenCalledWith(productId, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = 'product-1';
      mockProductsService.remove.mockResolvedValue({ id: productId, deleted: true });

      const result = await controller.remove(productId);

      expect(result).toEqual({ id: productId, deleted: true });
      expect(mockProductsService.remove).toHaveBeenCalledWith(productId);
    });
  });

  describe('findByManufacturer', () => {
    it('should return products by manufacturer ID', async () => {
      const manufacturerId = 'manufacturer-1';
      const expectedResult = [
        {
          id: 'product-1',
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          manufacturerId: manufacturerId,
        },
      ];

      mockProductsService.findByManufacturer.mockResolvedValue(expectedResult);

      const result = await controller.findByManufacturer(manufacturerId);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.findByManufacturer).toHaveBeenCalledWith(manufacturerId);
    });
  });

  describe('updatePrice', () => {
    it('should update product price', async () => {
      const productId = 'product-1';
      const newPrice = 150;

      const expectedResult = {
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: newPrice,
        manufacturerId: 'manufacturer-1',
      };

      mockProductsService.updatePrice.mockResolvedValue(expectedResult);

      const result = await controller.updatePrice(productId, newPrice);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.updatePrice).toHaveBeenCalledWith(productId, newPrice);
    });
  });
}); 