import { User as PrismaUser } from '@prisma/client';
import { SalesRep } from './sales-rep.entity';

export type User = Omit<PrismaUser, 'salesRep'> & {
  salesRep?: SalesRep;
}; 