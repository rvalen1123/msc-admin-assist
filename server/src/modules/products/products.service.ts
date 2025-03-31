import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
      include: {
        manufacturer: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        manufacturer: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        manufacturer: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          manufacturer: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findByManufacturer(manufacturerId: string) {
    return this.prisma.product.findMany({
      where: { manufacturerId },
      include: {
        manufacturer: true,
      },
    });
  }

  async updatePrice(id: string, price: number) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { price },
        include: {
          manufacturer: true,
        },
      });

      // Create price history record
      await this.prisma.priceHistory.create({
        data: {
          productId: id,
          quarter: this.getCurrentQuarter(),
          price,
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  private getCurrentQuarter(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter}${year}`;
  }
} 