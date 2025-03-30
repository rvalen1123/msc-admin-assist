import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { Request, Response } from 'express';

@ApiTags('forms')
@Controller('forms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('templates')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new form template' })
  @ApiResponse({ status: 201, description: 'Form template created successfully' })
  createTemplate(@Body() createFormTemplateDto: CreateFormTemplateDto) {
    return this.formsService.createTemplate(createFormTemplateDto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all form templates' })
  @ApiResponse({ status: 200, description: 'Returns all form templates' })
  findAllTemplates() {
    return this.formsService.findAllTemplates();
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a form template by ID' })
  @ApiResponse({ status: 200, description: 'Returns the form template' })
  findTemplateById(@Param('id') id: string) {
    return this.formsService.findTemplateById(id);
  }

  @Post('submissions')
  @ApiOperation({ summary: 'Create a new form submission' })
  @ApiResponse({ status: 201, description: 'Form submission created successfully' })
  createSubmission(
    @Body() createFormSubmissionDto: CreateFormSubmissionDto,
    @Req() req: Request,
  ) {
    return this.formsService.createSubmission(
      createFormSubmissionDto,
      req.user['id'],
    );
  }

  @Get('submissions')
  @ApiOperation({ summary: 'Get all form submissions' })
  @ApiResponse({ status: 200, description: 'Returns all form submissions' })
  findAllSubmissions() {
    return this.formsService.findAllSubmissions();
  }

  @Get('submissions/:id')
  @ApiOperation({ summary: 'Get a form submission by ID' })
  @ApiResponse({ status: 200, description: 'Returns the form submission' })
  findSubmissionById(@Param('id') id: string) {
    return this.formsService.findSubmissionById(id);
  }

  @Put('submissions/:id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update form submission status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  updateSubmissionStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.formsService.updateSubmissionStatus(id, status);
  }

  @Get('submissions/:id/pdf')
  @ApiOperation({ summary: 'Get PDF for a completed form submission' })
  @ApiResponse({ status: 200, description: 'Returns the PDF file' })
  async getSubmissionPdf(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.formsService.getSubmissionPdf(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=submission.pdf');
    res.send(pdfBuffer);
  }
} 