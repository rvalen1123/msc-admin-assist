import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { CreateProductDto } from '../products/dto/create-product.dto';

@Injectable()
export class TestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Seeds the database with test data.
   * Only available in development and test environments.
   */
  async seedTestData(seedData: {
    users?: CreateUserDto[];
    customers?: CreateCustomerDto[];
    products?: CreateProductDto[];
    manufacturers?: { id: string; name: string; logo?: string }[];
  }) {
    // Only allow in non-production environments
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Seeding is not allowed in production');
    }

    const results = {
      users: [] as any[],
      customers: [] as any[],
      products: [] as any[],
      manufacturers: [] as any[],
    };

    // Create manufacturers first (products will need them)
    if (seedData.manufacturers && seedData.manufacturers.length > 0) {
      for (const manufacturer of seedData.manufacturers) {
        try {
          // Check if manufacturer exists
          const existingManufacturer = await this.prisma.manufacturer.findUnique({
            where: { id: manufacturer.id },
          });

          if (!existingManufacturer) {
            // Create new manufacturer
            const newManufacturer = await this.prisma.manufacturer.create({
              data: manufacturer,
            });
            results.manufacturers.push(newManufacturer);
          } else {
            results.manufacturers.push(existingManufacturer);
          }
        } catch (error) {
          console.error(`Error creating test manufacturer: ${error.message}`);
          throw error;
        }
      }
    }

    // Create users if provided
    if (seedData.users && seedData.users.length > 0) {
      for (const userData of seedData.users) {
        try {
          // Check if user exists (by email)
          const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
          });

          if (!existingUser) {
            // Create new user
            const newUser = await this.userService.create(userData);
            results.users.push(newUser);
          } else {
            results.users.push(existingUser);
          }
        } catch (error) {
          console.error(`Error creating test user: ${error.message}`);
          throw error;
        }
      }
    }

    // Create customers if provided
    if (seedData.customers && seedData.customers.length > 0) {
      for (const customerData of seedData.customers) {
        try {
          // Check if customer exists (by email)
          const existingCustomer = await this.prisma.customer.findFirst({
            where: { email: customerData.email },
          });

          if (!existingCustomer) {
            // Create new customer
            const { contacts, ...customerDataWithoutContacts } = customerData;
            const newCustomer = await this.prisma.customer.create({
              data: {
                ...customerDataWithoutContacts,
                contacts: contacts ? {
                  create: contacts
                } : undefined
              },
              include: {
                contacts: true
              }
            });
            results.customers.push(newCustomer);
          } else {
            results.customers.push(existingCustomer);
          }
        } catch (error) {
          console.error(`Error creating test customer: ${error.message}`);
          throw error;
        }
      }
    }

    // Create products if provided
    if (seedData.products && seedData.products.length > 0) {
      for (const productData of seedData.products) {
        try {
          // Check if product exists (by name and manufacturer)
          const existingProduct = await this.prisma.product.findFirst({
            where: { 
              name: productData.name,
              manufacturerId: productData.manufacturerId
            },
          });

          if (!existingProduct) {
            // Create new product
            const newProduct = await this.prisma.product.create({
              data: productData,
            });
            results.products.push(newProduct);
          } else {
            results.products.push(existingProduct);
          }
        } catch (error) {
          console.error(`Error creating test product: ${error.message}`);
          throw error;
        }
      }
    }

    return results;
  }

  /**
   * Cleans up test data.
   * Only available in development and test environments.
   */
  async cleanupTestData() {
    // Only allow in non-production environments
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Test data cleanup is not allowed in production');
    }

    // Clear test data in the correct order to respect foreign key constraints
    // First delete orders, then customers, products, manufacturers, and finally users
    
    const deletedOrders = await this.prisma.order.deleteMany({
      where: {
        customer: {
          email: {
            endsWith: '@example.com',
          },
        },
      },
    });
    
    const deletedCustomers = await this.prisma.customer.deleteMany({
      where: {
        email: {
          endsWith: '@example.com',
        },
      },
    });
    
    const deletedProducts = await this.prisma.product.deleteMany({
      where: {
        manufacturerId: {
          startsWith: 'test-',
        },
      },
    });
    
    const deletedManufacturers = await this.prisma.manufacturer.deleteMany({
      where: {
        id: {
          startsWith: 'test-',
        },
      },
    });
    
    const deletedUsers = await this.prisma.user.deleteMany({
      where: {
        email: {
          endsWith: '@example.com',
        },
      },
    });

    return {
      deletedCount: {
        orders: deletedOrders.count,
        customers: deletedCustomers.count,
        products: deletedProducts.count,
        manufacturers: deletedManufacturers.count,
        users: deletedUsers.count,
      },
    };
  }
} 