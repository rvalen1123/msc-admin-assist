import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './forms.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { DocusealService } from './docuseal.service';
import { SubmissionStatus } from './enums/submission-status.enum';
import { TestHelper } from '../../common/testing/test-helper';
import { mockPrismaService } from '../../common/testing/mock-services';

describe('FormsService', () => {
  let service: FormsService;
  let prismaService: PrismaService;
  let docusealService: DocusealService;

  const mockDocusealService = {
    createSubmission: jest.fn(),
    getSubmissionStatus: jest.fn(),
    getSubmissionPdf: jest.fn(),
    downloadPdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([
      FormsService,
      {
        provide: DocusealService,
        useValue: mockDocusealService,
      },
    ]);

    service = module.get<FormsService>(FormsService);
    prismaService = module.get<PrismaService>(PrismaService);
    docusealService = module.get<DocusealService>(DocusealService);
  });

  afterEach(() => {
    TestHelper.resetAllMocks();
  });

  describe('createTemplate', () => {
    it('should create a form template', async () => {
      const createFormTemplateDto = {
        type: 'WOUND_ASSESSMENT',
        title: 'Wound Assessment Form',
        description: 'Form for wound assessment',
        schema: { fields: [] },
      };

      // Service stringifies the schema
      const stringifiedSchema = JSON.stringify(createFormTemplateDto.schema);
      
      // Database response has stringified schema
      const databaseResponse = {
        id: '1',
        type: 'WOUND_ASSESSMENT',
        title: 'Wound Assessment Form',
        description: 'Form for wound assessment',
        schema: stringifiedSchema,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // But the service parses it back when returning
      const expectedTemplate = {
        ...databaseResponse,
        schema: createFormTemplateDto.schema,
      };

      mockPrismaService.formTemplate.create.mockResolvedValue(databaseResponse);

      const result = await service.createTemplate(createFormTemplateDto);

      expect(result).toEqual(databaseResponse);
      expect(mockPrismaService.formTemplate.create).toHaveBeenCalledWith({
        data: {
          ...createFormTemplateDto,
          schema: stringifiedSchema,
        },
      });
    });
  });

  describe('findAllTemplates', () => {
    it('should return all form templates with submission counts', async () => {
      const schema = { fields: [] };
      const stringifiedSchema = JSON.stringify(schema);
      
      const databaseResponse = [
        {
          id: '1',
          type: 'WOUND_ASSESSMENT',
          title: 'Wound Assessment Form',
          description: 'Form for wound assessment',
          schema: stringifiedSchema,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            submissions: 2,
          },
        },
      ];

      const expectedTemplates = [
        {
          ...databaseResponse[0],
          schema,
        },
      ];

      mockPrismaService.formTemplate.findMany.mockResolvedValue(databaseResponse);

      const result = await service.findAllTemplates();

      expect(result).toEqual(expectedTemplates);
      expect(mockPrismaService.formTemplate.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      });
    });
  });

  describe('findTemplateById', () => {
    it('should return a form template by ID with its submissions', async () => {
      const templateId = '1';
      const schema = { fields: [] };
      const stringifiedSchema = JSON.stringify(schema);
      
      const databaseResponse = {
        id: templateId,
        type: 'WOUND_ASSESSMENT',
        title: 'Wound Assessment Form',
        description: 'Form for wound assessment',
        schema: stringifiedSchema,
        createdAt: new Date(),
        updatedAt: new Date(),
        submissions: [],
      };

      const expectedTemplate = {
        ...databaseResponse,
        schema,
        submissions: [],
      };

      mockPrismaService.formTemplate.findUnique.mockResolvedValue(databaseResponse);

      const result = await service.findTemplateById(templateId);

      expect(result).toEqual(expectedTemplate);
      expect(mockPrismaService.formTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: templateId },
        include: {
          submissions: {
            include: {
              user: true,
              customer: true,
            },
          },
        },
      });
    });
  });

  describe('createSubmission', () => {
    it('should create a form submission', async () => {
      const formData = { field1: 'value1' };
      const stringifiedData = JSON.stringify(formData);
      const templateSchema = { fields: [] };
      const stringifiedSchema = JSON.stringify(templateSchema);

      const createFormSubmissionDto = {
        templateId: '1',
        customerId: '1',
        data: formData,
      };

      const userId = 'user-1';
      const mockDocusealId = 'docuseal-1';
      const timestamp = new Date();

      // First database response after initial creation
      const initialSubmission = {
        id: 'submission-1',
        templateId: createFormSubmissionDto.templateId,
        customerId: createFormSubmissionDto.customerId,
        userId,
        data: stringifiedData,
        status: 'DRAFT',
        docusealId: null,
        createdAt: timestamp,
        submittedAt: null,
        completedAt: null,
        template: {
          id: '1',
          title: 'Wound Assessment Form',
          schema: stringifiedSchema,
        },
        user: {
          id: userId,
          firstName: 'John',
          lastName: 'Doe',
        },
        customer: {
          id: '1',
          name: 'Test Customer',
        },
      };

      // Response after updating with DocuSeal info
      const updatedSubmission = {
        ...initialSubmission,
        status: 'PROCESSING',
        docusealId: mockDocusealId,
        submittedAt: timestamp,
      };

      // Expected final result with parsed data
      const expectedFinalResult = {
        ...updatedSubmission,
        data: formData,
        template: {
          ...updatedSubmission.template,
          schema: templateSchema,
        },
      };

      mockPrismaService.formSubmission.create.mockResolvedValue(initialSubmission);
      mockDocusealService.createSubmission.mockResolvedValue(mockDocusealId);
      mockPrismaService.formSubmission.update.mockResolvedValue(updatedSubmission);

      const result = await service.createSubmission(createFormSubmissionDto, userId);

      expect(mockPrismaService.formSubmission.create).toHaveBeenCalledWith({
        data: {
          templateId: createFormSubmissionDto.templateId,
          customerId: createFormSubmissionDto.customerId,
          userId,
          data: stringifiedData,
          status: 'DRAFT',
        },
        include: {
          template: true,
          user: true,
          customer: true,
        },
      });

      expect(mockDocusealService.createSubmission).toHaveBeenCalledWith(
        createFormSubmissionDto.templateId,
        formData,
      );

      expect(mockPrismaService.formSubmission.update).toHaveBeenCalledWith({
        where: { id: initialSubmission.id },
        data: {
          status: 'PROCESSING',
          submittedAt: expect.any(Date),
        },
        include: {
          template: true,
          user: true,
          customer: true,
        },
      });

      expect(result).toEqual(updatedSubmission);
    });
  });

  describe('findAllSubmissions', () => {
    it('should return all form submissions', async () => {
      const formData = { field1: 'value1' };
      const stringifiedData = JSON.stringify(formData);
      const templateSchema = { fields: [] };
      const stringifiedSchema = JSON.stringify(templateSchema);
      const timestamp = new Date();

      const databaseResponse = [
        {
          id: 'submission-1',
          templateId: '1',
          customerId: '1',
          userId: 'user-1',
          data: stringifiedData,
          status: SubmissionStatus.PENDING,
          docusealId: 'docuseal-1',
          createdAt: timestamp,
          template: {
            id: '1',
            title: 'Wound Assessment Form',
            schema: stringifiedSchema,
          },
          customer: {
            id: '1',
            name: 'Test Customer',
          },
          user: {
            id: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      ];

      const expectedResult = [
        {
          ...databaseResponse[0],
          data: formData,
          template: {
            ...databaseResponse[0].template,
            schema: templateSchema,
          },
        },
      ];

      mockPrismaService.formSubmission.findMany.mockResolvedValue(databaseResponse);

      const result = await service.findAllSubmissions();

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.formSubmission.findMany).toHaveBeenCalledWith({
        include: {
          template: true,
          user: true,
          customer: true,
        },
      });
    });
  });

  describe('updateSubmissionStatus', () => {
    it('should update submission status', async () => {
      const submissionId = 'submission-1';
      const status = SubmissionStatus.COMPLETED;
      const formData = { field1: 'value1' };
      const stringifiedData = JSON.stringify(formData);
      const templateSchema = { fields: [] };
      const stringifiedSchema = JSON.stringify(templateSchema);
      const timestamp = new Date();

      const databaseResponse = {
        id: submissionId,
        status,
        data: stringifiedData,
        completedAt: timestamp,
        template: {
          id: '1',
          title: 'Wound Assessment Form',
          schema: stringifiedSchema,
        },
        user: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
        },
        customer: {
          id: '1',
          name: 'Test Customer',
        },
      };

      const expectedResult = {
        ...databaseResponse,
        data: formData,
        template: {
          ...databaseResponse.template,
          schema: templateSchema,
        },
      };

      mockPrismaService.formSubmission.update.mockResolvedValue(databaseResponse);

      const result = await service.updateSubmissionStatus(submissionId, status);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.formSubmission.update).toHaveBeenCalledWith({
        where: { id: submissionId },
        data: {
          status,
          completedAt: expect.any(Date),
        },
        include: {
          template: true,
          user: true,
          customer: true,
        },
      });
    });
  });

  describe('getSubmissionPdf', () => {
    it('should return PDF for a completed submission', async () => {
      const submissionId = 'submission-1';
      const formData = { field1: 'value1' };
      const stringifiedData = JSON.stringify(formData);
      const templateSchema = { fields: [] };
      const stringifiedSchema = JSON.stringify(templateSchema);
      const mockPdfBuffer = Buffer.from('mock-pdf-content');
      const timestamp = new Date();

      const databaseResponse = {
        id: submissionId,
        docusealId: 'docuseal-1',
        status: SubmissionStatus.COMPLETED,
        data: stringifiedData,
        template: {
          id: '1',
          title: 'Wound Assessment Form',
          schema: stringifiedSchema,
        },
        user: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
        },
        customer: {
          id: '1',
          name: 'Test Customer',
        },
      };

      const parsedSubmission = {
        ...databaseResponse,
        data: formData,
        template: {
          ...databaseResponse.template,
          schema: templateSchema,
        },
      };

      mockPrismaService.formSubmission.findUnique.mockResolvedValue(databaseResponse);
      mockDocusealService.downloadPdf.mockResolvedValue(mockPdfBuffer);

      const result = await service.getSubmissionPdf(submissionId);

      expect(result).toEqual(mockPdfBuffer);
      expect(mockPrismaService.formSubmission.findUnique).toHaveBeenCalledWith({
        where: { id: submissionId },
        include: {
          template: true,
          user: true,
          customer: true,
        },
      });
      expect(mockDocusealService.downloadPdf).toHaveBeenCalledWith(submissionId);
    });
  });
}); 