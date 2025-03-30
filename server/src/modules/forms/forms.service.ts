import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DocusealService } from './docuseal.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private prisma: PrismaService,
    private docusealService: DocusealService,
  ) {}

  async createTemplate(createFormTemplateDto: CreateFormTemplateDto) {
    return this.prisma.formTemplate.create({
      data: createFormTemplateDto,
    });
  }

  async findAllTemplates() {
    return this.prisma.formTemplate.findMany({
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
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

    return template;
  }

  async createSubmission(createFormSubmissionDto: CreateFormSubmissionDto, userId: string) {
    // Create the form submission in our database
    const submission = await this.prisma.formSubmission.create({
      data: {
        ...createFormSubmissionDto,
        userId,
        status: SubmissionStatus.DRAFT,
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
        submission.data,
      );

      // Update the submission with DocuSeal ID and status
      return this.prisma.formSubmission.update({
        where: { id: submission.id },
        data: {
          status: SubmissionStatus.PROCESSING,
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
          status: SubmissionStatus.REJECTED,
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

    return submission;
  }

  async findAllSubmissions() {
    return this.prisma.formSubmission.findMany({
      include: {
        template: true,
        user: true,
        customer: true,
      },
    });
  }

  async updateSubmissionStatus(id: string, status: SubmissionStatus) {
    const submission = await this.prisma.formSubmission.update({
      where: { id },
      data: {
        status,
        completedAt: status === SubmissionStatus.COMPLETED ? new Date() : null,
      },
      include: {
        template: true,
        user: true,
        customer: true,
      },
    });

    return submission;
  }

  async getSubmissionPdf(id: string) {
    const submission = await this.findSubmissionById(id);
    
    if (submission.status !== SubmissionStatus.COMPLETED) {
      throw new Error('Submission is not completed');
    }

    return this.docusealService.downloadPdf(id);
  }
} 