import { Test, TestingModule } from '@nestjs/testing';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { UserRole } from '../../modules/users/enums/user-role.enum';
import { Response } from 'express';
import { TestHelper } from '../../common/testing/test-helper';
import { mockFormsService } from '../../common/testing/mock-services';
import { SubmissionStatus } from './enums/submission-status.enum';

describe('FormsController', () => {
  let controller: FormsController;
  let formsService: FormsService;

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([
      FormsController,
    ]);

    controller = module.get<FormsController>(FormsController);
    formsService = module.get<FormsService>(FormsService);
  });

  afterEach(() => {
    TestHelper.resetAllMocks();
  });

  describe('createTemplate', () => {
    it('should create a form template', async () => {
      const createFormTemplateDto: CreateFormTemplateDto = {
        type: 'wound_assessment',
        title: 'Wound Assessment Form',
        description: 'Standard wound assessment form',
        schema: { fields: [] },
      };

      const expectedTemplate = {
        id: '1',
        ...createFormTemplateDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFormsService.createTemplate.mockResolvedValue(expectedTemplate);

      const result = await controller.createTemplate(createFormTemplateDto);

      expect(result).toEqual(expectedTemplate);
      expect(mockFormsService.createTemplate).toHaveBeenCalledWith(createFormTemplateDto);
    });
  });

  describe('findAllTemplates', () => {
    it('should return all form templates', async () => {
      const expectedTemplates = [
        {
          id: '1',
          type: 'wound_assessment',
          title: 'Wound Assessment Form',
          _count: { submissions: 5 },
        },
      ];

      mockFormsService.findAllTemplates.mockResolvedValue(expectedTemplates);

      const result = await controller.findAllTemplates();

      expect(result).toEqual(expectedTemplates);
      expect(mockFormsService.findAllTemplates).toHaveBeenCalled();
    });
  });

  describe('findTemplateById', () => {
    it('should return a form template by ID', async () => {
      const templateId = '1';
      const expectedTemplate = {
        id: templateId,
        type: 'wound_assessment',
        title: 'Wound Assessment Form',
        submissions: [],
      };

      mockFormsService.findTemplateById.mockResolvedValue(expectedTemplate);

      const result = await controller.findTemplateById(templateId);

      expect(result).toEqual(expectedTemplate);
      expect(mockFormsService.findTemplateById).toHaveBeenCalledWith(templateId);
    });
  });

  describe('createSubmission', () => {
    it('should create a form submission', async () => {
      const createFormSubmissionDto: CreateFormSubmissionDto = {
        templateId: '1',
        customerId: '1',
        data: { field1: 'value1' },
      };

      const mockUser = { id: '1', role: UserRole.CUSTOMER };
      const expectedSubmission = {
        id: '1',
        ...createFormSubmissionDto,
        userId: mockUser.id,
        createdAt: new Date(),
      };

      mockFormsService.createSubmission.mockResolvedValue(expectedSubmission);

      const result = await controller.createSubmission(createFormSubmissionDto, {
        user: mockUser,
      } as any);

      expect(result).toEqual(expectedSubmission);
      expect(mockFormsService.createSubmission).toHaveBeenCalledWith(
        createFormSubmissionDto,
        mockUser.id,
      );
    });
  });

  describe('findAllSubmissions', () => {
    it('should return all form submissions', async () => {
      const expectedSubmissions = [
        {
          id: '1',
          templateId: '1',
          customerId: '1',
          data: { field1: 'value1' },
        },
      ];

      mockFormsService.findAllSubmissions.mockResolvedValue(expectedSubmissions);

      const result = await controller.findAllSubmissions();

      expect(result).toEqual(expectedSubmissions);
      expect(mockFormsService.findAllSubmissions).toHaveBeenCalled();
    });
  });

  describe('findSubmissionById', () => {
    it('should return a form submission by ID', async () => {
      const submissionId = '1';
      const expectedSubmission = {
        id: submissionId,
        templateId: '1',
        customerId: '1',
        data: { field1: 'value1' },
      };

      mockFormsService.findSubmissionById.mockResolvedValue(expectedSubmission);

      const result = await controller.findSubmissionById(submissionId);

      expect(result).toEqual(expectedSubmission);
      expect(mockFormsService.findSubmissionById).toHaveBeenCalledWith(submissionId);
    });
  });

  describe('updateSubmissionStatus', () => {
    it('should update submission status', async () => {
      const submissionId = '1';
      const status = SubmissionStatus.COMPLETED;
      const expectedSubmission = {
        id: submissionId,
        status,
        completedAt: new Date(),
      };

      mockFormsService.updateSubmissionStatus.mockResolvedValue(expectedSubmission);

      const result = await controller.updateSubmissionStatus(submissionId, status);

      expect(result).toEqual(expectedSubmission);
      expect(mockFormsService.updateSubmissionStatus).toHaveBeenCalledWith(
        submissionId,
        status,
      );
    });
  });

  describe('getSubmissionPdf', () => {
    it('should return PDF file for completed submission', async () => {
      const submissionId = '1';
      const mockPdfBuffer = Buffer.from('mock-pdf-content');
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      mockFormsService.getSubmissionPdf.mockResolvedValue(mockPdfBuffer);

      await controller.getSubmissionPdf(submissionId, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=submission.pdf',
      );
      expect(mockResponse.send).toHaveBeenCalledWith(mockPdfBuffer);
      expect(mockFormsService.getSubmissionPdf).toHaveBeenCalledWith(submissionId);
    });
  });
}); 