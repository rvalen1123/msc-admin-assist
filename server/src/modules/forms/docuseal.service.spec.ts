import { Test, TestingModule } from '@nestjs/testing';
import { DocusealService } from './docuseal.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DocusealService', () => {
  let service: DocusealService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        DOCUSEAL_API_KEY: 'test-api-key',
        DOCUSEAL_API_URL: 'https://api.docuseal.co/v1',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocusealService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DocusealService>(DocusealService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSubmission', () => {
    it('should create a submission successfully', async () => {
      const templateId = 'template-1';
      const data = { field1: 'value1' };
      const expectedResponse = { id: 'submission-1' };

      mockedAxios.post.mockResolvedValueOnce({ data: expectedResponse });

      const result = await service.createSubmission(templateId, data);

      expect(result).toEqual(expectedResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.docuseal.co/v1/submissions',
        {
          template_id: templateId,
          data,
        },
        {
          headers: {
            Authorization: 'Bearer test-api-key',
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('should handle API errors', async () => {
      const templateId = 'template-1';
      const data = { field1: 'value1' };
      const errorMessage = 'API Error';

      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.createSubmission(templateId, data)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('getSubmissionStatus', () => {
    it('should get submission status successfully', async () => {
      const submissionId = 'submission-1';
      const expectedResponse = { status: 'completed' };

      mockedAxios.get.mockResolvedValueOnce({ data: expectedResponse });

      const result = await service.getSubmissionStatus(submissionId);

      expect(result).toEqual(expectedResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.docuseal.co/v1/submissions/submission-1',
        {
          headers: {
            Authorization: 'Bearer test-api-key',
          },
        },
      );
    });

    it('should handle API errors', async () => {
      const submissionId = 'submission-1';
      const errorMessage = 'API Error';

      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.getSubmissionStatus(submissionId)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('downloadPdf', () => {
    it('should download PDF successfully', async () => {
      const submissionId = 'submission-1';
      const mockPdfBuffer = Buffer.from('mock-pdf-content');

      mockedAxios.get.mockResolvedValueOnce({ data: mockPdfBuffer });

      const result = await service.downloadPdf(submissionId);

      expect(result).toEqual(mockPdfBuffer);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.docuseal.co/v1/submissions/submission-1/pdf',
        {
          headers: {
            Authorization: 'Bearer test-api-key',
          },
          responseType: 'arraybuffer',
        },
      );
    });

    it('should handle API errors', async () => {
      const submissionId = 'submission-1';
      const errorMessage = 'API Error';

      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.downloadPdf(submissionId)).rejects.toThrow(errorMessage);
    });
  });
}); 