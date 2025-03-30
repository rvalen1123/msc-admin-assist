-- DropForeignKey
ALTER TABLE [dbo].[PriceHistory] DROP CONSTRAINT [FK_PriceHistory_Product_productId];
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [FK_OrderItem_Product_productId];
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [FK_OrderItem_Order_orderId];
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [FK_Order_User_salesRepId];
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [FK_Order_Customer_customerId];
ALTER TABLE [dbo].[FormSubmission] DROP CONSTRAINT [FK_FormSubmission_Customer_customerId];
ALTER TABLE [dbo].[FormSubmission] DROP CONSTRAINT [FK_FormSubmission_User_userId];
ALTER TABLE [dbo].[FormSubmission] DROP CONSTRAINT [FK_FormSubmission_FormTemplate_templateId];
ALTER TABLE [dbo].[SalesRep] DROP CONSTRAINT [FK_SalesRep_User_userId];
ALTER TABLE [dbo].[Product] DROP CONSTRAINT [FK_Product_Manufacturer_manufacturerId];
ALTER TABLE [dbo].[CustomerContact] DROP CONSTRAINT [FK_CustomerContact_Customer_customerId];

-- DropIndex
DROP INDEX [IX_PriceHistory_updatedAt] ON [dbo].[PriceHistory];
DROP INDEX [IX_PriceHistory_quarter] ON [dbo].[PriceHistory];
DROP INDEX [IX_PriceHistory_productId] ON [dbo].[PriceHistory];
DROP INDEX [IX_OrderItem_productId] ON [dbo].[OrderItem];
DROP INDEX [IX_OrderItem_orderId] ON [dbo].[OrderItem];
DROP INDEX [IX_Order_status] ON [dbo].[Order];
DROP INDEX [IX_Order_salesRepId] ON [dbo].[Order];
DROP INDEX [IX_Order_customerId] ON [dbo].[Order];
DROP INDEX [IX_Order_orderNumber] ON [dbo].[Order];
DROP INDEX [IX_FormSubmission_completedAt] ON [dbo].[FormSubmission];
DROP INDEX [IX_FormSubmission_submittedAt] ON [dbo].[FormSubmission];
DROP INDEX [IX_FormSubmission_status] ON [dbo].[FormSubmission];
DROP INDEX [IX_FormSubmission_customerId] ON [dbo].[FormSubmission];
DROP INDEX [IX_FormSubmission_userId] ON [dbo].[FormSubmission];
DROP INDEX [IX_FormSubmission_templateId] ON [dbo].[FormSubmission];
DROP INDEX [IX_FormTemplate_type] ON [dbo].[FormTemplate];
DROP INDEX [IX_SalesRep_active] ON [dbo].[SalesRep];
DROP INDEX [IX_SalesRep_region] ON [dbo].[SalesRep];
DROP INDEX [IX_SalesRep_territory] ON [dbo].[SalesRep];
DROP INDEX [IX_SalesRep_userId] ON [dbo].[SalesRep];
DROP INDEX [IX_Manufacturer_name] ON [dbo].[Manufacturer];
DROP INDEX [IX_Product_qCode] ON [dbo].[Product];
DROP INDEX [IX_Product_name] ON [dbo].[Product];
DROP INDEX [IX_Product_manufacturerId] ON [dbo].[Product];
DROP INDEX [IX_CustomerContact_isPrimary] ON [dbo].[CustomerContact];
DROP INDEX [IX_CustomerContact_email] ON [dbo].[CustomerContact];
DROP INDEX [IX_CustomerContact_customerId] ON [dbo].[CustomerContact];
DROP INDEX [IX_Customer_company] ON [dbo].[Customer];
DROP INDEX [IX_Customer_name] ON [dbo].[Customer];
DROP INDEX [IX_Customer_email] ON [dbo].[Customer];
DROP INDEX [IX_User_role] ON [dbo].[User];
DROP INDEX [IX_User_email] ON [dbo].[User];

-- DropTable
DROP TABLE [dbo].[PriceHistory];
DROP TABLE [dbo].[OrderItem];
DROP TABLE [dbo].[Order];
DROP TABLE [dbo].[FormSubmission];
DROP TABLE [dbo].[FormTemplate];
DROP TABLE [dbo].[SalesRep];
DROP TABLE [dbo].[Manufacturer];
DROP TABLE [dbo].[Product];
DROP TABLE [dbo].[CustomerContact];
DROP TABLE [dbo].[Customer];
DROP TABLE [dbo].[User];

-- DropEnum
DROP TYPE [dbo].[OrderStatus];
DROP TYPE [dbo].[SubmissionStatus];
DROP TYPE [dbo].[UserRole]; 