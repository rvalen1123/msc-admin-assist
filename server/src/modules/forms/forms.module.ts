import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { DocusealService } from './docuseal.service';

@Module({
  imports: [PrismaModule],
  controllers: [FormsController],
  providers: [FormsService, DocusealService],
  exports: [FormsService],
})
export class FormsModule {} 