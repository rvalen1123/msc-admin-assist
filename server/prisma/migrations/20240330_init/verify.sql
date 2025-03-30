-- Verify table existence
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
AND TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME;

-- Verify column data types
SELECT 
    t.TABLE_NAME,
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.CHARACTER_MAXIMUM_LENGTH,
    c.IS_NULLABLE
FROM INFORMATION_SCHEMA.TABLES t
JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
WHERE t.TABLE_SCHEMA = 'dbo'
AND t.TABLE_TYPE = 'BASE TABLE'
ORDER BY t.TABLE_NAME, c.ORDINAL_POSITION;

-- Verify indexes
SELECT 
    t.name AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType,
    c.name AS ColumnName
FROM sys.indexes i
JOIN sys.tables t ON i.object_id = t.object_id
JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE t.schema_id = SCHEMA_ID('dbo')
ORDER BY t.name, i.name, ic.key_ordinal;

-- Verify constraints
SELECT 
    t.name AS TableName,
    c.name AS ConstraintName,
    c.type_desc AS ConstraintType,
    OBJECT_DEFINITION(c.object_id) AS ConstraintDefinition
FROM sys.tables t
JOIN sys.objects c ON t.object_id = c.parent_object_id
WHERE t.schema_id = SCHEMA_ID('dbo')
AND c.type IN ('PK', 'FK', 'C', 'UQ')
ORDER BY t.name, c.name;

-- Verify sample data
SELECT COUNT(*) AS UserCount FROM [dbo].[User];
SELECT COUNT(*) AS CustomerCount FROM [dbo].[Customer];
SELECT COUNT(*) AS ProductCount FROM [dbo].[Product];
SELECT COUNT(*) AS OrderCount FROM [dbo].[Order];

-- Verify data integrity
SELECT 
    'User' AS TableName,
    COUNT(*) AS TotalRows,
    COUNT(DISTINCT [role]) AS UniqueRoles
FROM [dbo].[User]
UNION ALL
SELECT 
    'Order',
    COUNT(*),
    COUNT(DISTINCT [status])
FROM [dbo].[Order]
UNION ALL
SELECT 
    'FormSubmission',
    COUNT(*),
    COUNT(DISTINCT [status])
FROM [dbo].[FormSubmission];

-- Verify JSON data conversion
SELECT 
    COUNT(*) AS TotalTemplates,
    COUNT(CASE WHEN [schema] IS NOT NULL THEN 1 END) AS TemplatesWithSchema
FROM [dbo].[FormTemplate];

-- Verify price data conversion
SELECT 
    COUNT(*) AS TotalProducts,
    COUNT(CASE WHEN [price] IS NOT NULL THEN 1 END) AS ProductsWithPrice,
    COUNT(CASE WHEN [nationalAsp] IS NOT NULL THEN 1 END) AS ProductsWithNationalAsp
FROM [dbo].[Product];

-- Verify relationships
SELECT 
    'Order -> Customer' AS Relationship,
    COUNT(*) AS TotalOrders,
    COUNT(DISTINCT [customerId]) AS UniqueCustomers
FROM [dbo].[Order]
UNION ALL
SELECT 
    'OrderItem -> Product',
    COUNT(*),
    COUNT(DISTINCT [productId])
FROM [dbo].[OrderItem]
UNION ALL
SELECT 
    'FormSubmission -> Customer',
    COUNT(*),
    COUNT(DISTINCT [customerId])
FROM [dbo].[FormSubmission]; 