/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `phone` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `addressLine1` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `addressLine2` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `city` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `state` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `zipCode` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `country` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - The primary key for the `CustomerContact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `CustomerContact` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `title` on the `CustomerContact` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `phone` on the `CustomerContact` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - The primary key for the `FormSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `data` on the `FormSubmission` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `pdfUrl` on the `FormSubmission` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - The primary key for the `FormTemplate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `title` on the `FormTemplate` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `description` on the `FormTemplate` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `schema` on the `FormTemplate` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - The primary key for the `Manufacturer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `logoUrl` on the `Manufacturer` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `shippingAddress` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `billingAddress` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `notes` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PriceHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `description` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `mue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - The primary key for the `SalesRep` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to alter the column `company` on the `User` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - A unique constraint covering the columns `[userId]` on the table `SalesRep` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CustomerContact] DROP CONSTRAINT [FK_CustomerContact_Customer_customerId];

-- DropForeignKey
ALTER TABLE [dbo].[FormSubmission] DROP CONSTRAINT [FK_FormSubmission_Customer_customerId];

-- DropForeignKey
ALTER TABLE [dbo].[FormSubmission] DROP CONSTRAINT [FK_FormSubmission_FormTemplate_templateId];

-- DropForeignKey
ALTER TABLE [dbo].[FormSubmission] DROP CONSTRAINT [FK_FormSubmission_User_userId];

-- DropForeignKey
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [FK_Order_Customer_customerId];

-- DropForeignKey
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [FK_Order_User_salesRepId];

-- DropForeignKey
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [FK_OrderItem_Order_orderId];

-- DropForeignKey
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [FK_OrderItem_Product_productId];

-- DropForeignKey
ALTER TABLE [dbo].[PriceHistory] DROP CONSTRAINT [FK_PriceHistory_Product_productId];

-- DropForeignKey
ALTER TABLE [dbo].[Product] DROP CONSTRAINT [FK_Product_Manufacturer_manufacturerId];

-- DropForeignKey
ALTER TABLE [dbo].[SalesRep] DROP CONSTRAINT [FK_SalesRep_User_userId];

-- DropIndex
DROP INDEX [IX_Customer_company] ON [dbo].[Customer];

-- DropIndex
DROP INDEX [IX_Customer_email] ON [dbo].[Customer];

-- DropIndex
DROP INDEX [IX_Customer_name] ON [dbo].[Customer];

-- DropIndex
DROP INDEX [IX_CustomerContact_customerId] ON [dbo].[CustomerContact];

-- DropIndex
DROP INDEX [IX_CustomerContact_email] ON [dbo].[CustomerContact];

-- DropIndex
DROP INDEX [IX_FormSubmission_customerId] ON [dbo].[FormSubmission];

-- DropIndex
DROP INDEX [IX_FormSubmission_status] ON [dbo].[FormSubmission];

-- DropIndex
DROP INDEX [IX_FormSubmission_templateId] ON [dbo].[FormSubmission];

-- DropIndex
DROP INDEX [IX_FormSubmission_userId] ON [dbo].[FormSubmission];

-- DropIndex
DROP INDEX [IX_FormTemplate_type] ON [dbo].[FormTemplate];

-- DropIndex
DROP INDEX [IX_Manufacturer_name] ON [dbo].[Manufacturer];

-- DropIndex
DROP INDEX [IX_Order_customerId] ON [dbo].[Order];

-- DropIndex
DROP INDEX [IX_Order_orderNumber] ON [dbo].[Order];

-- DropIndex
DROP INDEX [IX_Order_salesRepId] ON [dbo].[Order];

-- DropIndex
DROP INDEX [IX_Order_status] ON [dbo].[Order];

-- DropIndex
DROP INDEX [IX_OrderItem_orderId] ON [dbo].[OrderItem];

-- DropIndex
DROP INDEX [IX_OrderItem_productId] ON [dbo].[OrderItem];

-- DropIndex
DROP INDEX [IX_PriceHistory_productId] ON [dbo].[PriceHistory];

-- DropIndex
DROP INDEX [IX_PriceHistory_quarter] ON [dbo].[PriceHistory];

-- DropIndex
DROP INDEX [IX_Product_manufacturerId] ON [dbo].[Product];

-- DropIndex
DROP INDEX [IX_Product_name] ON [dbo].[Product];

-- DropIndex
DROP INDEX [IX_Product_qCode] ON [dbo].[Product];

-- DropIndex
DROP INDEX [IX_SalesRep_region] ON [dbo].[SalesRep];

-- DropIndex
DROP INDEX [IX_SalesRep_territory] ON [dbo].[SalesRep];

-- DropIndex
DROP INDEX [IX_SalesRep_userId] ON [dbo].[SalesRep];

-- DropIndex
DROP INDEX [IX_User_email] ON [dbo].[User];

-- DropIndex
DROP INDEX [IX_User_role] ON [dbo].[User];

-- AlterTable
ALTER TABLE [dbo].[Customer] DROP CONSTRAINT [PK_Customer];
EXEC SP_RENAME N'dbo.PK_Customer', N'Customer_pkey';
ALTER TABLE [dbo].[Customer] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [name] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [email] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [phone] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [company] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [addressLine1] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [addressLine2] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [city] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [state] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [zipCode] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [country] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT Customer_pkey PRIMARY KEY CLUSTERED ([id]);

-- AlterTable
ALTER TABLE [dbo].[CustomerContact] DROP CONSTRAINT [DF__CustomerC__isPri__05F8DC4F],
[PK_CustomerContact];
EXEC SP_RENAME N'dbo.PK_CustomerContact', N'CustomerContact_pkey';
ALTER TABLE [dbo].[CustomerContact] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[CustomerContact] ALTER COLUMN [customerId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[CustomerContact] ALTER COLUMN [name] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[CustomerContact] ALTER COLUMN [title] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[CustomerContact] ALTER COLUMN [email] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[CustomerContact] ALTER COLUMN [phone] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[CustomerContact] ADD CONSTRAINT CustomerContact_pkey PRIMARY KEY CLUSTERED ([id]), CONSTRAINT [CustomerContact_isPrimary_df] DEFAULT 0 FOR [isPrimary];

-- AlterTable
ALTER TABLE [dbo].[FormSubmission] DROP CONSTRAINT [DF__FormSubmi__statu__162F4418],
[PK_FormSubmission];
EXEC SP_RENAME N'dbo.PK_FormSubmission', N'FormSubmission_pkey';
ALTER TABLE [dbo].[FormSubmission] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormSubmission] ALTER COLUMN [templateId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormSubmission] ALTER COLUMN [userId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormSubmission] ALTER COLUMN [customerId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormSubmission] ALTER COLUMN [data] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormSubmission] ALTER COLUMN [status] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormSubmission] ALTER COLUMN [pdfUrl] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT FormSubmission_pkey PRIMARY KEY CLUSTERED ([id]), CONSTRAINT [FormSubmission_status_df] DEFAULT 'DRAFT' FOR [status];

-- AlterTable
ALTER TABLE [dbo].[FormTemplate] DROP CONSTRAINT [PK_FormTemplate];
EXEC SP_RENAME N'dbo.PK_FormTemplate', N'FormTemplate_pkey';
ALTER TABLE [dbo].[FormTemplate] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormTemplate] ALTER COLUMN [type] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormTemplate] ALTER COLUMN [title] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormTemplate] ALTER COLUMN [description] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[FormTemplate] ALTER COLUMN [schema] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FormTemplate] ADD CONSTRAINT FormTemplate_pkey PRIMARY KEY CLUSTERED ([id]);

-- AlterTable
ALTER TABLE [dbo].[Manufacturer] DROP CONSTRAINT [PK_Manufacturer];
EXEC SP_RENAME N'dbo.PK_Manufacturer', N'Manufacturer_pkey';
ALTER TABLE [dbo].[Manufacturer] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Manufacturer] ALTER COLUMN [name] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Manufacturer] ALTER COLUMN [logoUrl] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Manufacturer] ADD CONSTRAINT Manufacturer_pkey PRIMARY KEY CLUSTERED ([id]);

-- AlterTable
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [DF__Order__status__19FFD4FC],
[PK_Order];
EXEC SP_RENAME N'dbo.PK_Order', N'Order_pkey';
ALTER TABLE [dbo].[Order] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [orderNumber] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [customerId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [salesRepId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [status] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [shippingAddress] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [billingAddress] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Order] ALTER COLUMN [notes] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Order] ADD CONSTRAINT Order_pkey PRIMARY KEY CLUSTERED ([id]), CONSTRAINT [Order_status_df] DEFAULT 'DRAFT' FOR [status];

-- AlterTable
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [PK_OrderItem];
EXEC SP_RENAME N'dbo.PK_OrderItem', N'OrderItem_pkey';
ALTER TABLE [dbo].[OrderItem] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[OrderItem] ALTER COLUMN [orderId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[OrderItem] ALTER COLUMN [productId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT OrderItem_pkey PRIMARY KEY CLUSTERED ([id]);

-- AlterTable
ALTER TABLE [dbo].[PriceHistory] DROP CONSTRAINT [PK_PriceHistory];
EXEC SP_RENAME N'dbo.PK_PriceHistory', N'PriceHistory_pkey';
ALTER TABLE [dbo].[PriceHistory] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[PriceHistory] ALTER COLUMN [productId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[PriceHistory] ALTER COLUMN [quarter] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[PriceHistory] ADD CONSTRAINT PriceHistory_pkey PRIMARY KEY CLUSTERED ([id]);

-- AlterTable
ALTER TABLE [dbo].[Product] DROP CONSTRAINT [PK_Product];
EXEC SP_RENAME N'dbo.PK_Product', N'Product_pkey';
ALTER TABLE [dbo].[Product] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [name] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [manufacturerId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [description] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [qCode] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [mue] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Product] ADD CONSTRAINT Product_pkey PRIMARY KEY CLUSTERED ([id]);

-- AlterTable
ALTER TABLE [dbo].[SalesRep] DROP CONSTRAINT [DF__SalesRep__active__0F824689],
[PK_SalesRep];
EXEC SP_RENAME N'dbo.PK_SalesRep', N'SalesRep_pkey';
ALTER TABLE [dbo].[SalesRep] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[SalesRep] ALTER COLUMN [userId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[SalesRep] ALTER COLUMN [territory] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[SalesRep] ALTER COLUMN [region] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[SalesRep] ADD CONSTRAINT SalesRep_pkey PRIMARY KEY CLUSTERED ([id]), CONSTRAINT [SalesRep_active_df] DEFAULT 1 FOR [active];

-- AlterTable
ALTER TABLE [dbo].[User] DROP CONSTRAINT [PK_User];
EXEC SP_RENAME N'dbo.PK_User', N'User_pkey';
ALTER TABLE [dbo].[User] ALTER COLUMN [id] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [email] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [role] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [firstName] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [lastName] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [company] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[User] DROP COLUMN [passwordHash];
ALTER TABLE [dbo].[User] ADD CONSTRAINT User_pkey PRIMARY KEY CLUSTERED ([id]), CONSTRAINT [User_role_df] DEFAULT 'USER' FOR [role];
ALTER TABLE [dbo].[User] ADD [name] NVARCHAR(1000) NOT NULL,
[password] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[RefreshToken] (
    [id] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefreshToken_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefreshToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefreshToken_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_role_idx] ON [dbo].[User]([role]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [RefreshToken_userId_idx] ON [dbo].[RefreshToken]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [RefreshToken_expiresAt_idx] ON [dbo].[RefreshToken]([expiresAt]);

-- CreateIndex
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [Customer_email_key] UNIQUE NONCLUSTERED ([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Customer_name_idx] ON [dbo].[Customer]([name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Customer_company_idx] ON [dbo].[Customer]([company]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CustomerContact_customerId_idx] ON [dbo].[CustomerContact]([customerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CustomerContact_email_idx] ON [dbo].[CustomerContact]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Product_manufacturerId_idx] ON [dbo].[Product]([manufacturerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Product_name_idx] ON [dbo].[Product]([name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Product_qCode_idx] ON [dbo].[Product]([qCode]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Manufacturer_name_idx] ON [dbo].[Manufacturer]([name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SalesRep_territory_idx] ON [dbo].[SalesRep]([territory]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SalesRep_region_idx] ON [dbo].[SalesRep]([region]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormTemplate_type_idx] ON [dbo].[FormTemplate]([type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormSubmission_templateId_idx] ON [dbo].[FormSubmission]([templateId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormSubmission_userId_idx] ON [dbo].[FormSubmission]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormSubmission_customerId_idx] ON [dbo].[FormSubmission]([customerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormSubmission_status_idx] ON [dbo].[FormSubmission]([status]);

-- CreateIndex
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_orderNumber_key] UNIQUE NONCLUSTERED ([orderNumber]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Order_customerId_idx] ON [dbo].[Order]([customerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Order_salesRepId_idx] ON [dbo].[Order]([salesRepId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Order_status_idx] ON [dbo].[Order]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [OrderItem_orderId_idx] ON [dbo].[OrderItem]([orderId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [OrderItem_productId_idx] ON [dbo].[OrderItem]([productId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [PriceHistory_productId_idx] ON [dbo].[PriceHistory]([productId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [PriceHistory_quarter_idx] ON [dbo].[PriceHistory]([quarter]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Customer_email_idx] ON [dbo].[Customer]([email]);

-- CreateIndex
ALTER TABLE [dbo].[SalesRep] ADD CONSTRAINT [SalesRep_userId_key] UNIQUE NONCLUSTERED ([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_email_idx] ON [dbo].[User]([email]);

-- AddForeignKey
ALTER TABLE [dbo].[RefreshToken] ADD CONSTRAINT [RefreshToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CustomerContact] ADD CONSTRAINT [CustomerContact_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_manufacturerId_fkey] FOREIGN KEY ([manufacturerId]) REFERENCES [dbo].[Manufacturer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SalesRep] ADD CONSTRAINT [SalesRep_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT [FormSubmission_templateId_fkey] FOREIGN KEY ([templateId]) REFERENCES [dbo].[FormTemplate]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT [FormSubmission_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT [FormSubmission_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_salesRepId_fkey] FOREIGN KEY ([salesRepId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PriceHistory] ADD CONSTRAINT [PriceHistory_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- RenameIndex
EXEC SP_RENAME N'dbo.Customer.IX_Customer_company', N'Customer_company_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Customer.IX_Customer_email', N'Customer_email_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Customer.IX_Customer_name', N'Customer_name_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.CustomerContact.IX_CustomerContact_customerId', N'CustomerContact_customerId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.CustomerContact.IX_CustomerContact_email', N'CustomerContact_email_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.CustomerContact.IX_CustomerContact_isPrimary', N'CustomerContact_isPrimary_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.FormSubmission.IX_FormSubmission_completedAt', N'FormSubmission_completedAt_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.FormSubmission.IX_FormSubmission_customerId', N'FormSubmission_customerId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.FormSubmission.IX_FormSubmission_status', N'FormSubmission_status_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.FormSubmission.IX_FormSubmission_submittedAt', N'FormSubmission_submittedAt_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.FormSubmission.IX_FormSubmission_templateId', N'FormSubmission_templateId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.FormSubmission.IX_FormSubmission_userId', N'FormSubmission_userId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.FormTemplate.IX_FormTemplate_type', N'FormTemplate_type_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Manufacturer.IX_Manufacturer_name', N'Manufacturer_name_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Order.IX_Order_customerId', N'Order_customerId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Order.IX_Order_orderNumber', N'Order_orderNumber_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Order.IX_Order_salesRepId', N'Order_salesRepId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Order.IX_Order_status', N'Order_status_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.OrderItem.IX_OrderItem_orderId', N'OrderItem_orderId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.OrderItem.IX_OrderItem_productId', N'OrderItem_productId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.PriceHistory.IX_PriceHistory_productId', N'PriceHistory_productId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.PriceHistory.IX_PriceHistory_quarter', N'PriceHistory_quarter_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.PriceHistory.IX_PriceHistory_updatedAt', N'PriceHistory_updatedAt_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Product.IX_Product_manufacturerId', N'Product_manufacturerId_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Product.IX_Product_name', N'Product_name_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Product.IX_Product_qCode', N'Product_qCode_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.SalesRep.IX_SalesRep_active', N'SalesRep_active_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.SalesRep.IX_SalesRep_region', N'SalesRep_region_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.SalesRep.IX_SalesRep_territory', N'SalesRep_territory_idx', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.User.IX_User_email', N'User_email_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.User.IX_User_role', N'User_role_idx', N'INDEX';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
