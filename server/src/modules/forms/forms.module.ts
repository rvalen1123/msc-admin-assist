import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DocusealService } from './docuseal.service';

@Module({
  controllers: [FormsController],
  providers: [FormsService, PrismaService, DocusealService],
  exports: [FormsService],
})
export class FormsModule {} 