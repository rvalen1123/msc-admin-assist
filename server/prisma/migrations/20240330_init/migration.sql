-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(450) NOT NULL,
    [email] NVARCHAR(450) NOT NULL,
    [passwordHash] NVARCHAR(MAX) NOT NULL,
    [role] NVARCHAR(20) NOT NULL,
    [firstName] NVARCHAR(MAX),
    [lastName] NVARCHAR(MAX),
    [company] NVARCHAR(MAX),
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] NVARCHAR(450) NOT NULL,
    [name] NVARCHAR(450) NOT NULL,
    [email] NVARCHAR(450) NOT NULL,
    [phone] NVARCHAR(MAX),
    [company] NVARCHAR(450),
    [addressLine1] NVARCHAR(MAX),
    [addressLine2] NVARCHAR(MAX),
    [city] NVARCHAR(MAX),
    [state] NVARCHAR(MAX),
    [zipCode] NVARCHAR(MAX),
    [country] NVARCHAR(MAX),
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CustomerContact] (
    [id] NVARCHAR(450) NOT NULL,
    [customerId] NVARCHAR(450) NOT NULL,
    [name] NVARCHAR(MAX) NOT NULL,
    [title] NVARCHAR(MAX),
    [email] NVARCHAR(450),
    [phone] NVARCHAR(MAX),
    [isPrimary] BIT NOT NULL DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_CustomerContact] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] NVARCHAR(450) NOT NULL,
    [name] NVARCHAR(450) NOT NULL,
    [manufacturerId] NVARCHAR(450) NOT NULL,
    [description] NVARCHAR(MAX),
    [price] FLOAT,
    [qCode] NVARCHAR(450),
    [nationalAsp] FLOAT,
    [mue] NVARCHAR(MAX),
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Manufacturer] (
    [id] NVARCHAR(450) NOT NULL,
    [name] NVARCHAR(450) NOT NULL,
    [logoUrl] NVARCHAR(MAX),
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Manufacturer] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SalesRep] (
    [id] NVARCHAR(450) NOT NULL,
    [userId] NVARCHAR(450) NOT NULL,
    [territory] NVARCHAR(450),
    [region] NVARCHAR(450),
    [active] BIT NOT NULL DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_SalesRep] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FormTemplate] (
    [id] NVARCHAR(450) NOT NULL,
    [type] NVARCHAR(450) NOT NULL,
    [title] NVARCHAR(MAX) NOT NULL,
    [description] NVARCHAR(MAX),
    [schema] NVARCHAR(MAX) NOT NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PK_FormTemplate] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FormSubmission] (
    [id] NVARCHAR(450) NOT NULL,
    [templateId] NVARCHAR(450) NOT NULL,
    [userId] NVARCHAR(450) NOT NULL,
    [customerId] NVARCHAR(450) NOT NULL,
    [data] NVARCHAR(MAX) NOT NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    [submittedAt] DATETIME2,
    [completedAt] DATETIME2,
    [pdfUrl] NVARCHAR(MAX),
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_FormSubmission] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [id] NVARCHAR(450) NOT NULL,
    [orderNumber] NVARCHAR(450) NOT NULL,
    [customerId] NVARCHAR(450) NOT NULL,
    [salesRepId] NVARCHAR(450) NOT NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    [totalAmount] FLOAT NOT NULL,
    [shippingAddress] NVARCHAR(MAX) NOT NULL,
    [billingAddress] NVARCHAR(MAX) NOT NULL,
    [notes] NVARCHAR(MAX),
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL,
    [shippedAt] DATETIME2,
    [deliveredAt] DATETIME2,
    [cancelledAt] DATETIME2,
    [refundedAt] DATETIME2,
    CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderItem] (
    [id] NVARCHAR(450) NOT NULL,
    [orderId] NVARCHAR(450) NOT NULL,
    [productId] NVARCHAR(450) NOT NULL,
    [quantity] INT NOT NULL,
    [unitPrice] FLOAT NOT NULL,
    [totalPrice] FLOAT NOT NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PriceHistory] (
    [id] NVARCHAR(450) NOT NULL,
    [productId] NVARCHAR(450) NOT NULL,
    [quarter] NVARCHAR(450) NOT NULL,
    [price] FLOAT,
    [nationalAsp] FLOAT,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PK_PriceHistory] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [IX_User_email] ON [dbo].[User]([email]);
CREATE NONCLUSTERED INDEX [IX_User_role] ON [dbo].[User]([role]);

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [IX_Customer_email] ON [dbo].[Customer]([email]);
CREATE NONCLUSTERED INDEX [IX_Customer_name] ON [dbo].[Customer]([name]);
CREATE NONCLUSTERED INDEX [IX_Customer_company] ON [dbo].[Customer]([company]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_CustomerContact_customerId] ON [dbo].[CustomerContact]([customerId]);
CREATE NONCLUSTERED INDEX [IX_CustomerContact_email] ON [dbo].[CustomerContact]([email]);
CREATE NONCLUSTERED INDEX [IX_CustomerContact_isPrimary] ON [dbo].[CustomerContact]([isPrimary]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Product_manufacturerId] ON [dbo].[Product]([manufacturerId]);
CREATE NONCLUSTERED INDEX [IX_Product_name] ON [dbo].[Product]([name]);
CREATE NONCLUSTERED INDEX [IX_Product_qCode] ON [dbo].[Product]([qCode]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Manufacturer_name] ON [dbo].[Manufacturer]([name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_SalesRep_userId] ON [dbo].[SalesRep]([userId]);
CREATE NONCLUSTERED INDEX [IX_SalesRep_territory] ON [dbo].[SalesRep]([territory]);
CREATE NONCLUSTERED INDEX [IX_SalesRep_region] ON [dbo].[SalesRep]([region]);
CREATE NONCLUSTERED INDEX [IX_SalesRep_active] ON [dbo].[SalesRep]([active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_FormTemplate_type] ON [dbo].[FormTemplate]([type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_FormSubmission_templateId] ON [dbo].[FormSubmission]([templateId]);
CREATE NONCLUSTERED INDEX [IX_FormSubmission_userId] ON [dbo].[FormSubmission]([userId]);
CREATE NONCLUSTERED INDEX [IX_FormSubmission_customerId] ON [dbo].[FormSubmission]([customerId]);
CREATE NONCLUSTERED INDEX [IX_FormSubmission_status] ON [dbo].[FormSubmission]([status]);
CREATE NONCLUSTERED INDEX [IX_FormSubmission_submittedAt] ON [dbo].[FormSubmission]([submittedAt]);
CREATE NONCLUSTERED INDEX [IX_FormSubmission_completedAt] ON [dbo].[FormSubmission]([completedAt]);

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [IX_Order_orderNumber] ON [dbo].[Order]([orderNumber]);
CREATE NONCLUSTERED INDEX [IX_Order_customerId] ON [dbo].[Order]([customerId]);
CREATE NONCLUSTERED INDEX [IX_Order_salesRepId] ON [dbo].[Order]([salesRepId]);
CREATE NONCLUSTERED INDEX [IX_Order_status] ON [dbo].[Order]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_OrderItem_orderId] ON [dbo].[OrderItem]([orderId]);
CREATE NONCLUSTERED INDEX [IX_OrderItem_productId] ON [dbo].[OrderItem]([productId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_PriceHistory_productId] ON [dbo].[PriceHistory]([productId]);
CREATE NONCLUSTERED INDEX [IX_PriceHistory_quarter] ON [dbo].[PriceHistory]([quarter]);
CREATE NONCLUSTERED INDEX [IX_PriceHistory_updatedAt] ON [dbo].[PriceHistory]([updatedAt]);

-- AddForeignKey
ALTER TABLE [dbo].[CustomerContact] ADD CONSTRAINT [FK_CustomerContact_Customer_customerId] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [FK_Product_Manufacturer_manufacturerId] FOREIGN KEY ([manufacturerId]) REFERENCES [dbo].[Manufacturer]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SalesRep] ADD CONSTRAINT [FK_SalesRep_User_userId] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT [FK_FormSubmission_FormTemplate_templateId] FOREIGN KEY ([templateId]) REFERENCES [dbo].[FormTemplate]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT [FK_FormSubmission_User_userId] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT [FK_FormSubmission_Customer_customerId] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [FK_Order_Customer_customerId] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [FK_Order_User_salesRepId] FOREIGN KEY ([salesRepId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [FK_OrderItem_Order_orderId] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [FK_OrderItem_Product_productId] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PriceHistory] ADD CONSTRAINT [FK_PriceHistory_Product_productId] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE CASCADE ON UPDATE NO ACTION; 