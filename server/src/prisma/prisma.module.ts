import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: () => {
        const prisma = new PrismaService();
        return prisma;
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {} 