-- Convert JSON data to NVARCHAR(MAX) for FormTemplate schema
UPDATE [dbo].[FormTemplate]
SET [schema] = CAST([schema] AS NVARCHAR(MAX))
WHERE [schema] IS NOT NULL;

-- Convert JSON data to NVARCHAR(MAX) for FormSubmission data
UPDATE [dbo].[FormSubmission]
SET [data] = CAST([data] AS NVARCHAR(MAX))
WHERE [data] IS NOT NULL;

-- Convert decimal values to float for Product prices
UPDATE [dbo].[Product]
SET [price] = CAST([price] AS FLOAT),
    [nationalAsp] = CAST([nationalAsp] AS FLOAT)
WHERE [price] IS NOT NULL
   OR [nationalAsp] IS NOT NULL;

-- Convert decimal values to float for OrderItem prices
UPDATE [dbo].[OrderItem]
SET [price] = CAST([price] AS FLOAT)
WHERE [price] IS NOT NULL;

-- Convert decimal values to float for PriceHistory prices
UPDATE [dbo].[PriceHistory]
SET [price] = CAST([price] AS FLOAT)
WHERE [price] IS NOT NULL;

-- Update enum values to match new string format
UPDATE [dbo].[User]
SET [role] = CASE [role]
    WHEN 'ADMIN' THEN 'ADMIN'
    WHEN 'SALES_REP' THEN 'SALES_REP'
    WHEN 'MANAGER' THEN 'MANAGER'
    ELSE 'USER'
END;

UPDATE [dbo].[FormSubmission]
SET [status] = CASE [status]
    WHEN 'DRAFT' THEN 'DRAFT'
    WHEN 'SUBMITTED' THEN 'SUBMITTED'
    WHEN 'COMPLETED' THEN 'COMPLETED'
    WHEN 'REJECTED' THEN 'REJECTED'
    ELSE 'DRAFT'
END;

UPDATE [dbo].[Order]
SET [status] = CASE [status]
    WHEN 'PENDING' THEN 'PENDING'
    WHEN 'APPROVED' THEN 'APPROVED'
    WHEN 'REJECTED' THEN 'REJECTED'
    WHEN 'COMPLETED' THEN 'COMPLETED'
    WHEN 'CANCELLED' THEN 'CANCELLED'
    ELSE 'PENDING'
END;

-- Add any missing indexes for performance optimization
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Order_createdAt' AND object_id = OBJECT_ID('[dbo].[Order]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Order_createdAt] ON [dbo].[Order]([createdAt]);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FormSubmission_createdAt' AND object_id = OBJECT_ID('[dbo].[FormSubmission]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_FormSubmission_createdAt] ON [dbo].[FormSubmission]([createdAt]);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Product_createdAt' AND object_id = OBJECT_ID('[dbo].[Product]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Product_createdAt] ON [dbo].[Product]([createdAt]);
END

-- Add any missing constraints
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Order_Status')
BEGIN
    ALTER TABLE [dbo].[Order]
    ADD CONSTRAINT [CK_Order_Status]
    CHECK ([status] IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'));
END

IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_FormSubmission_Status')
BEGIN
    ALTER TABLE [dbo].[FormSubmission]
    ADD CONSTRAINT [CK_FormSubmission_Status]
    CHECK ([status] IN ('DRAFT', 'SUBMITTED', 'COMPLETED', 'REJECTED'));
END

IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_User_Role')
BEGIN
    ALTER TABLE [dbo].[User]
    ADD CONSTRAINT [CK_User_Role]
    CHECK ([role] IN ('ADMIN', 'SALES_REP', 'MANAGER'));
END 