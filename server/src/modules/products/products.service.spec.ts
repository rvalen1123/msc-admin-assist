import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    priceHistory: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = {
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

      mockPrismaService.product.create.mockResolvedValue(expectedResult);

      const result = await service.create(createProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: createProductDto,
        include: {
          manufacturer: true,
        },
      });
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

      mockPrismaService.product.findMany.mockResolvedValue(expectedProducts);

      const result = await service.findAll();

      expect(result).toEqual(expectedProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        include: {
          manufacturer: true,
        },
      });
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

      mockPrismaService.product.findUnique.mockResolvedValue(expectedProduct);

      const result = await service.findOne(productId);

      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: {
          manufacturer: true,
        },
      });
    });

    it('should throw NotFoundException when product is not found', async () => {
      const productId = '1';
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(productId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = '1';
      const updateProductDto = {
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

      mockPrismaService.product.update.mockResolvedValue(expectedResult);

      const result = await service.update(productId, updateProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: updateProductDto,
        include: {
          manufacturer: true,
        },
      });
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      const productId = '1';
      const updateProductDto = {
        name: 'Updated Product',
      };

      mockPrismaService.product.update.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.update(productId, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const productId = '1';
      mockPrismaService.product.delete.mockResolvedValue({ id: productId });

      const result = await service.remove(productId);

      expect(result).toEqual({ message: 'Product deleted successfully' });
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });

    it('should throw NotFoundException when deleting non-existent product', async () => {
      const productId = '1';
      mockPrismaService.product.delete.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.remove(productId)).rejects.toThrow(NotFoundException);
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

      mockPrismaService.product.findMany.mockResolvedValue(expectedProducts);

      const result = await service.findByManufacturer(manufacturerId);

      expect(result).toEqual(expectedProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { manufacturerId },
        include: {
          manufacturer: true,
        },
      });
    });
  });

  describe('updatePrice', () => {
    it('should update product price and create price history', async () => {
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

      mockPrismaService.product.update.mockResolvedValue(expectedProduct);
      mockPrismaService.priceHistory.create.mockResolvedValue({
        id: '1',
        productId,
        price: newPrice,
        quarter: expect.any(String),
      });

      const result = await service.updatePrice(productId, newPrice);

      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { price: newPrice },
        include: {
          manufacturer: true,
        },
      });
      expect(mockPrismaService.priceHistory.create).toHaveBeenCalledWith({
        data: {
          productId,
          price: newPrice,
          quarter: expect.any(String),
        },
      });
    });

    it('should throw NotFoundException when updating price of non-existent product', async () => {
      const productId = '1';
      const newPrice = 199.99;

      mockPrismaService.product.update.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.updatePrice(productId, newPrice)).rejects.toThrow(NotFoundException);
    });
  });
}); 