-- Insert default user roles
INSERT INTO [dbo].[UserRole] ([value]) VALUES
('ADMIN'),
('SALES_REP'),
('MANAGER');

-- Insert default submission statuses
INSERT INTO [dbo].[SubmissionStatus] ([value]) VALUES
('DRAFT'),
('SUBMITTED'),
('COMPLETED'),
('REJECTED');

-- Insert default order statuses
INSERT INTO [dbo].[OrderStatus] ([value]) VALUES
('PENDING'),
('APPROVED'),
('REJECTED'),
('COMPLETED'),
('CANCELLED');

-- Insert default admin user
INSERT INTO [dbo].[User] ([id], [email], [name], [role], [createdAt], [updatedAt])
VALUES (
    NEWID(),
    'admin@mscwoundcare.com',
    'System Administrator',
    'ADMIN',
    GETDATE(),
    GETDATE()
);

-- Insert sample manufacturer
INSERT INTO [dbo].[Manufacturer] ([id], [name], [createdAt], [updatedAt])
VALUES (
    NEWID(),
    'Sample Manufacturer',
    GETDATE(),
    GETDATE()
);

-- Insert sample product
INSERT INTO [dbo].[Product] ([id], [name], [qCode], [manufacturerId], [price], [nationalAsp], [createdAt], [updatedAt])
SELECT 
    NEWID(),
    'Sample Product',
    'SAMPLE-001',
    [id],
    100.00,
    90.00,
    GETDATE(),
    GETDATE()
FROM [dbo].[Manufacturer]
WHERE [name] = 'Sample Manufacturer';

-- Insert sample customer
INSERT INTO [dbo].[Customer] ([id], [name], [email], [company], [createdAt], [updatedAt])
VALUES (
    NEWID(),
    'Sample Customer',
    'customer@example.com',
    'Sample Company',
    GETDATE(),
    GETDATE()
);

-- Insert sample customer contact
INSERT INTO [dbo].[CustomerContact] ([id], [name], [email], [phone], [isPrimary], [customerId], [createdAt], [updatedAt])
SELECT 
    NEWID(),
    'John Doe',
    'john@example.com',
    '555-0123',
    1,
    [id],
    GETDATE(),
    GETDATE()
FROM [dbo].[Customer]
WHERE [name] = 'Sample Customer';

-- Insert sample sales rep
INSERT INTO [dbo].[SalesRep] ([id], [userId], [territory], [region], [active], [createdAt], [updatedAt])
SELECT 
    NEWID(),
    [id],
    'Sample Territory',
    'Sample Region',
    1,
    GETDATE(),
    GETDATE()
FROM [dbo].[User]
WHERE [email] = 'admin@mscwoundcare.com';

-- Insert sample form template
INSERT INTO [dbo].[FormTemplate] ([id], [name], [type], [schema], [createdAt], [updatedAt])
VALUES (
    NEWID(),
    'Sample Form',
    'SAMPLE',
    '{"fields": []}',
    GETDATE(),
    GETDATE()
);

-- Insert sample order
INSERT INTO [dbo].[Order] ([id], [orderNumber], [customerId], [salesRepId], [status], [createdAt], [updatedAt])
SELECT 
    NEWID(),
    'ORD-001',
    c.[id],
    sr.[id],
    'PENDING',
    GETDATE(),
    GETDATE()
FROM [dbo].[Customer] c
CROSS JOIN [dbo].[SalesRep] sr
WHERE c.[name] = 'Sample Customer'
AND sr.[territory] = 'Sample Territory';

-- Insert sample order item
INSERT INTO [dbo].[OrderItem] ([id], [orderId], [productId], [quantity], [price], [createdAt], [updatedAt])
SELECT 
    NEWID(),
    o.[id],
    p.[id],
    1,
    p.[price],
    GETDATE(),
    GETDATE()
FROM [dbo].[Order] o
CROSS JOIN [dbo].[Product] p
WHERE o.[orderNumber] = 'ORD-001'
AND p.[qCode] = 'SAMPLE-001';

-- Insert sample price history
INSERT INTO [dbo].[PriceHistory] ([id], [productId], [price], [quarter], [createdAt], [updatedAt])
SELECT 
    NEWID(),
    [id],
    [price],
    'Q1 2024',
    GETDATE(),
    GETDATE()
FROM [dbo].[Product]
WHERE [qCode] = 'SAMPLE-001'; 