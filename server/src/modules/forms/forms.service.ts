import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocusealService } from './docuseal.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private prisma: PrismaService,
    private docusealService: DocusealService,
  ) {}

  async createTemplate(createFormTemplateDto: CreateFormTemplateDto) {
    return this.prisma.formTemplate.create({
      data: {
        ...createFormTemplateDto,
        schema: JSON.stringify(createFormTemplateDto.schema),
      },
    });
  }

  async findAllTemplates() {
    const templates = await this.prisma.formTemplate.findMany({
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    return templates.map(template => ({
      ...template,
      schema: JSON.parse(template.schema),
    }));
  }

  async findTemplateById(id: string) {
    const template = await this.prisma.formTemplate.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            user: true,
            customer: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Form template with ID ${id} not found`);
    }

    return {
      ...template,
      schema: JSON.parse(template.schema),
      submissions: template.submissions.map(submission => ({
        ...submission,
        data: JSON.parse(submission.data),
      })),
    };
  }

  async createSubmission(createFormSubmissionDto: CreateFormSubmissionDto, userId: string) {
    // Create the form submission in our database
    const submission = await this.prisma.formSubmission.create({
      data: {
        templateId: createFormSubmissionDto.templateId,
        customerId: createFormSubmissionDto.customerId,
        userId,
        data: JSON.stringify(createFormSubmissionDto.data),
        status: 'DRAFT',
      },
      include: {
        template: true,
        user: true,
        customer: true,
      },
    });

    try {
      // Create the submission in DocuSeal
      const docusealSubmission = await this.docusealService.createSubmission(
        submission.templateId,
        JSON.parse(submission.data),
      );

      // Update the submission with DocuSeal ID and status
      return this.prisma.formSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'PROCESSING',
          submittedAt: new Date(),
        },
        include: {
          template: true,
          user: true,
          customer: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create DocuSeal submission: ${error.message}`);
      // Update submission status to indicate failure
      await this.prisma.formSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'REJECTED',
        },
      });
      throw error;
    }
  }

  async findSubmissionById(id: string) {
    const submission = await this.prisma.formSubmission.findUnique({
      where: { id },
      include: {
        template: true,
        user: true,
        customer: true,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Form submission with ID ${id} not found`);
    }

    return {
      ...submission,
      data: JSON.parse(submission.data),
      template: {
        ...submission.template,
        schema: JSON.parse(submission.template.schema),
      },
    };
  }

  async findAllSubmissions() {
    const submissions = await this.prisma.formSubmission.findMany({
      include: {
        template: true,
        user: true,
        customer: true,
      },
    });

    return submissions.map(submission => ({
      ...submission,
      data: JSON.parse(submission.data),
      template: {
        ...submission.template,
        schema: JSON.parse(submission.template.schema),
      },
    }));
  }

  async updateSubmissionStatus(id: string, status: string) {
    const submission = await this.prisma.formSubmission.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        template: true,
        user: true,
        customer: true,
      },
    });

    return {
      ...submission,
      data: JSON.parse(submission.data),
      template: {
        ...submission.template,
        schema: JSON.parse(submission.template.schema),
      },
    };
  }

  async getSubmissionPdf(id: string) {
    const submission = await this.findSubmissionById(id);
    
    if (submission.status !== 'COMPLETED') {
      throw new Error('Submission is not completed');
    }

    return this.docusealService.downloadPdf(id);
  }
} 