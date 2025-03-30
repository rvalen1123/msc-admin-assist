import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './forms.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DocusealService } from './docuseal.service';
import { NotFoundException } from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';

describe('FormsService', () => {
  let service: FormsService;
  let prismaService: PrismaService;
  let docusealService: DocusealService;

  const mockPrismaService = {
    formTemplate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    formSubmission: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockDocusealService = {
    createSubmission: jest.fn(),
    getSubmissionStatus: jest.fn(),
    downloadPdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: DocusealService,
          useValue: mockDocusealService,
        },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    prismaService = module.get<PrismaService>(PrismaService);
    docusealService = module.get<DocusealService>(DocusealService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('should create a form template', async () => {
      const createFormTemplateDto = {
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

      mockPrismaService.formTemplate.create.mockResolvedValue(expectedTemplate);

      const result = await service.createTemplate(createFormTemplateDto);

      expect(result).toEqual(expectedTemplate);
      expect(mockPrismaService.formTemplate.create).toHaveBeenCalledWith({
        data: createFormTemplateDto,
      });
    });
  });

  describe('findAllTemplates', () => {
    it('should return all form templates with submission counts', async () => {
      const expectedTemplates = [
        {
          id: '1',
          type: 'wound_assessment',
          title: 'Wound Assessment Form',
          _count: { submissions: 5 },
        },
      ];

      mockPrismaService.formTemplate.findMany.mockResolvedValue(expectedTemplates);

      const result = await service.findAllTemplates();

      expect(result).toEqual(expectedTemplates);
      expect(mockPrismaService.formTemplate.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { submissions: true },
          },
        },
      });
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

      mockPrismaService.formTemplate.findUnique.mockResolvedValue(expectedTemplate);

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

    it('should throw NotFoundException when template not found', async () => {
      const templateId = '1';
      mockPrismaService.formTemplate.findUnique.mockResolvedValue(null);

      await expect(service.findTemplateById(templateId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createSubmission', () => {
    it('should create a form submission successfully', async () => {
      const createFormSubmissionDto = {
        templateId: '1',
        customerId: '1',
        data: { field1: 'value1' },
      };

      const userId = '1';
      const expectedSubmission = {
        id: '1',
        ...createFormSubmissionDto,
        userId,
        status: SubmissionStatus.DRAFT,
        createdAt: new Date(),
      };

      mockPrismaService.formSubmission.create.mockResolvedValue(expectedSubmission);
      mockDocusealService.createSubmission.mockResolvedValue({ id: 'docuseal-1' });
      mockPrismaService.formSubmission.update.mockResolvedValue({
        ...expectedSubmission,
        status: SubmissionStatus.PROCESSING,
        submittedAt: new Date(),
      });

      const result = await service.createSubmission(createFormSubmissionDto, userId);

      expect(result.status).toBe(SubmissionStatus.PROCESSING);
      expect(mockPrismaService.formSubmission.create).toHaveBeenCalled();
      expect(mockDocusealService.createSubmission).toHaveBeenCalled();
      expect(mockPrismaService.formSubmission.update).toHaveBeenCalled();
    });

    it('should handle DocuSeal API failure', async () => {
      const createFormSubmissionDto = {
        templateId: '1',
        customerId: '1',
        data: { field1: 'value1' },
      };

      const userId = '1';
      const expectedSubmission = {
        id: '1',
        ...createFormSubmissionDto,
        userId,
        status: SubmissionStatus.DRAFT,
        createdAt: new Date(),
      };

      mockPrismaService.formSubmission.create.mockResolvedValue(expectedSubmission);
      mockDocusealService.createSubmission.mockRejectedValue(new Error('API Error'));
      mockPrismaService.formSubmission.update.mockResolvedValue({
        ...expectedSubmission,
        status: SubmissionStatus.REJECTED,
      });

      await expect(
        service.createSubmission(createFormSubmissionDto, userId),
      ).rejects.toThrow('API Error');
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

      mockPrismaService.formSubmission.findUnique.mockResolvedValue(expectedSubmission);

      const result = await service.findSubmissionById(submissionId);

      expect(result).toEqual(expectedSubmission);
      expect(mockPrismaService.formSubmission.findUnique).toHaveBeenCalledWith({
        where: { id: submissionId },
        include: {
          template: true,
          user: true,
          customer: true,
        },
      });
    });

    it('should throw NotFoundException when submission not found', async () => {
      const submissionId = '1';
      mockPrismaService.formSubmission.findUnique.mockResolvedValue(null);

      await expect(service.findSubmissionById(submissionId)).rejects.toThrow(
        NotFoundException,
      );
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

      mockPrismaService.formSubmission.update.mockResolvedValue(expectedSubmission);

      const result = await service.updateSubmissionStatus(submissionId, status);

      expect(result).toEqual(expectedSubmission);
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
    it('should return PDF buffer for completed submission', async () => {
      const submissionId = '1';
      const mockPdfBuffer = Buffer.from('mock-pdf-content');

      mockPrismaService.formSubmission.findUnique.mockResolvedValue({
        id: submissionId,
        status: SubmissionStatus.COMPLETED,
      });
      mockDocusealService.downloadPdf.mockResolvedValue(mockPdfBuffer);

      const result = await service.getSubmissionPdf(submissionId);

      expect(result).toEqual(mockPdfBuffer);
      expect(mockDocusealService.downloadPdf).toHaveBeenCalledWith(submissionId);
    });

    it('should throw error for non-completed submission', async () => {
      const submissionId = '1';

      mockPrismaService.formSubmission.findUnique.mockResolvedValue({
        id: submissionId,
        status: SubmissionStatus.DRAFT,
      });

      await expect(service.getSubmissionPdf(submissionId)).rejects.toThrow(
        'Submission is not completed',
      );
    });
  });
}); 