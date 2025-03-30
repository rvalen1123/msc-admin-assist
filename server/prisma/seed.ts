import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.manufacturer.deleteMany();
  await prisma.formSubmission.deleteMany();
  await prisma.formTemplate.deleteMany();
  await prisma.customerContact.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.salesRep.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  // Create sales representatives
  const salesRepPasswordHash = await bcrypt.hash('salesrep123', 10);
  const salesRep1 = await prisma.user.create({
    data: {
      email: 'salesrep1@test.com',
      passwordHash: salesRepPasswordHash,
      role: UserRole.SALES,
      firstName: 'John',
      lastName: 'Doe',
      company: 'MSC Wound Care',
    },
  });

  const salesRep2 = await prisma.user.create({
    data: {
      email: 'salesrep2@test.com',
      passwordHash: salesRepPasswordHash,
      role: UserRole.SALES,
      firstName: 'Jane',
      lastName: 'Smith',
      company: 'MSC Wound Care',
    },
  });

  // Create sales rep records
  await prisma.salesRep.create({
    data: {
      userId: salesRep1.id,
      territory: 'North',
      region: 'Northeast',
      active: true,
    },
  });

  await prisma.salesRep.create({
    data: {
      userId: salesRep2.id,
      territory: 'South',
      region: 'Southeast',
      active: true,
    },
  });

  // Create manufacturers
  const manufacturer1 = await prisma.manufacturer.create({
    data: {
      name: 'Smith & Nephew',
      logoUrl: 'https://example.com/smith-nephew-logo.png',
    },
  });

  const manufacturer2 = await prisma.manufacturer.create({
    data: {
      name: '3M Health Care',
      logoUrl: 'https://example.com/3m-logo.png',
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Advanced Wound Dressing',
      manufacturerId: manufacturer1.id,
      description: 'Advanced wound care dressing with antimicrobial properties',
      price: 150.00,
      qCode: 'AWD001',
      nationalAsp: 175.00,
      mue: '1',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Compression Bandage',
      manufacturerId: manufacturer2.id,
      description: 'High-quality compression bandage for wound care',
      price: 75.00,
      qCode: 'CB001',
      nationalAsp: 85.00,
      mue: '2',
    },
  });

  // Create price history
  await prisma.priceHistory.create({
    data: {
      productId: product1.id,
      quarter: 'Q1-2024',
      price: 150.00,
      nationalAsp: 175.00,
    },
  });

  await prisma.priceHistory.create({
    data: {
      productId: product2.id,
      quarter: 'Q1-2024',
      price: 75.00,
      nationalAsp: 85.00,
    },
  });

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Acme Medical Center',
      email: 'orders@acmemedical.com',
      phone: '555-0123',
      company: 'Acme Medical Center',
      addressLine1: '123 Medical Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'City Hospital',
      email: 'supplies@cityhospital.com',
      phone: '555-0124',
      company: 'City Hospital',
      addressLine1: '456 Healthcare Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
  });

  // Create customer contacts
  await prisma.customerContact.create({
    data: {
      customerId: customer1.id,
      name: 'Dr. Sarah Johnson',
      title: 'Medical Director',
      email: 'sarah.johnson@acmemedical.com',
      phone: '555-0125',
      isPrimary: true,
    },
  });

  await prisma.customerContact.create({
    data: {
      customerId: customer2.id,
      name: 'Dr. Michael Chen',
      title: 'Chief of Surgery',
      email: 'michael.chen@cityhospital.com',
      phone: '555-0126',
      isPrimary: true,
    },
  });

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD2403300001',
      customerId: customer1.id,
      salesRepId: salesRep1.id,
      status: OrderStatus.CONFIRMED,
      totalAmount: 450.00,
      shippingAddress: '123 Medical Plaza, New York, NY 10001',
      billingAddress: '123 Medical Plaza, New York, NY 10001',
      notes: 'Urgent order for wound care supplies',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 2,
            unitPrice: 150.00,
            totalPrice: 300.00,
          },
          {
            productId: product2.id,
            quantity: 2,
            unitPrice: 75.00,
            totalPrice: 150.00,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD2403300002',
      customerId: customer2.id,
      salesRepId: salesRep2.id,
      status: OrderStatus.PENDING,
      totalAmount: 225.00,
      shippingAddress: '456 Healthcare Ave, Los Angeles, CA 90001',
      billingAddress: '456 Healthcare Ave, Los Angeles, CA 90001',
      notes: 'Regular supply order',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: 150.00,
            totalPrice: 150.00,
          },
          {
            productId: product2.id,
            quantity: 1,
            unitPrice: 75.00,
            totalPrice: 75.00,
          },
        ],
      },
    },
  });

  // Create form templates
  const formTemplate1 = await prisma.formTemplate.create({
    data: {
      type: 'WOUND_ASSESSMENT',
      title: 'Wound Assessment Form',
      description: 'Standard wound assessment form for medical professionals',
      schema: {
        fields: [
          {
            name: 'woundLocation',
            label: 'Wound Location',
            type: 'text',
            required: true,
          },
          {
            name: 'woundSize',
            label: 'Wound Size (cm)',
            type: 'number',
            required: true,
          },
          {
            name: 'woundType',
            label: 'Wound Type',
            type: 'select',
            options: ['Acute', 'Chronic', 'Surgical', 'Other'],
            required: true,
          },
        ],
      },
    },
  });

  // Create form submissions
  await prisma.formSubmission.create({
    data: {
      templateId: formTemplate1.id,
      userId: salesRep1.id,
      customerId: customer1.id,
      data: {
        woundLocation: 'Left leg',
        woundSize: 5.2,
        woundType: 'Chronic',
      },
      status: 'COMPLETED',
      submittedAt: new Date(),
      completedAt: new Date(),
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 