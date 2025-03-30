import { PrismaClient } from '@prisma/client';
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
      role: 'ADMIN',
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
      role: 'SALES',
      firstName: 'John',
      lastName: 'Doe',
      company: 'MSC Wound Care',
    },
  });

  const salesRep2 = await prisma.user.create({
    data: {
      email: 'salesrep2@test.com',
      passwordHash: salesRepPasswordHash,
      role: 'SALES',
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

  // Create sample manufacturer
  const manufacturer = await prisma.manufacturer.create({
    data: {
      name: 'Sample Manufacturer',
      logoUrl: 'https://example.com/logo.png',
    },
  });

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      name: 'Sample Product 1',
      manufacturerId: manufacturer.id,
      description: 'A sample wound care product',
      price: 99.99,
      qCode: 'Q4001',
      nationalAsp: 89.99,
      mue: '10 units per month',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Sample Product 2',
      manufacturerId: manufacturer.id,
      description: 'Another sample wound care product',
      price: 149.99,
      qCode: 'Q4002',
      nationalAsp: 139.99,
      mue: '5 units per month',
    },
  });

  // Create sample customer
  const customer = await prisma.customer.create({
    data: {
      name: 'Sample Medical Center',
      email: 'info@samplemedical.com',
      phone: '555-0123',
      company: 'Sample Medical Group',
      addressLine1: '123 Medical Way',
      city: 'Sample City',
      state: 'NY',
      zipCode: '12345',
      country: 'USA',
    },
  });

  // Create customer contact
  await prisma.customerContact.create({
    data: {
      customerId: customer.id,
      name: 'John Contact',
      title: 'Purchasing Manager',
      email: 'john@samplemedical.com',
      phone: '555-0124',
      isPrimary: true,
    },
  });

  // Create sample form template
  const formTemplate = await prisma.formTemplate.create({
    data: {
      type: 'WOUND_ASSESSMENT',
      title: 'Wound Assessment Form',
      description: 'Standard wound assessment form',
      schema: JSON.stringify({
        fields: [
          {
            name: 'woundLocation',
            label: 'Wound Location',
            type: 'text',
            required: true,
          },
          {
            name: 'woundType',
            label: 'Wound Type',
            type: 'select',
            options: ['Pressure Ulcer', 'Diabetic Ulcer', 'Venous Ulcer', 'Surgical Wound'],
            required: true,
          },
        ],
      }),
    },
  });

  // Create sample form submission
  await prisma.formSubmission.create({
    data: {
      templateId: formTemplate.id,
      userId: salesRep1.id,
      customerId: customer.id,
      status: 'COMPLETED',
      data: JSON.stringify({
        woundLocation: 'Left heel',
        woundType: 'Pressure Ulcer',
      }),
      submittedAt: new Date(),
      completedAt: new Date(),
      pdfUrl: 'https://example.com/submission.pdf',
    },
  });

  // Create sample order
  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      customerId: customer.id,
      salesRepId: salesRep1.id,
      status: 'CONFIRMED',
      totalAmount: 349.97,
      shippingAddress: '123 Medical Way, Sample City, NY 12345',
      billingAddress: '123 Medical Way, Sample City, NY 12345',
      notes: 'Sample order notes',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 2,
            unitPrice: 99.99,
            totalPrice: 199.98,
          },
          {
            productId: product2.id,
            quantity: 1,
            unitPrice: 149.99,
            totalPrice: 149.99,
          },
        ],
      },
    },
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 