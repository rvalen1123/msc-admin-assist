import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  mockPrismaService, 
  mockConfigService, 
  mockJwtService,
  mockProductsService,
  mockCustomersService,
  mockFormsService,
  mockOrdersService
} from './mock-services';
import { ProductsService } from '../../modules/products/products.service';
import { CustomersService } from '../../modules/customers/customers.service';
import { FormsService } from '../../modules/forms/forms.service';
import { OrdersService } from '../../modules/orders/orders.service';

export class TestHelper {
  /**
   * Creates a standard testing module with common mocks
   */
  static async createTestingModule(additionalProviders: any[] = []): Promise<TestingModule> {
    return Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
        {
          provide: FormsService,
          useValue: mockFormsService,
        },
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        ...additionalProviders,
      ],
    }).compile();
  }

  /**
   * Reset all mocks
   */
  static resetAllMocks(): void {
    jest.clearAllMocks();
    Object.values(mockPrismaService).forEach(
      (mockEntity) => {
        if (typeof mockEntity === 'object' && mockEntity !== null) {
          Object.values(mockEntity).forEach(
            (mockMethod) => {
              if (typeof mockMethod === 'function') {
                (mockMethod as jest.Mock).mockReset();
              }
            }
          );
        }
      }
    );
  }
} 