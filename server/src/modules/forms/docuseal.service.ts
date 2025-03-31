import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DocusealService {
  private readonly logger = new Logger(DocusealService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DOCUSEAL_API_KEY');
    this.baseUrl = this.configService.get<string>('DOCUSEAL_API_URL');
  }

  async createSubmission(templateId: string, data: Record<string, any>) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/submissions`,
        {
          template_id: templateId,
          data,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create DocuSeal submission: ${error.message}`);
      throw error;
    }
  }

  async getSubmissionStatus(submissionId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/submissions/${submissionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get DocuSeal submission status: ${error.message}`);
      throw error;
    }
  }

  async downloadPdf(submissionId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/submissions/${submissionId}/pdf`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          responseType: 'arraybuffer',
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to download PDF from DocuSeal: ${error.message}`);
      throw error;
    }
  }
} 