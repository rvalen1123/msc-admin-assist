import { SalesRep as PrismaSalesRep } from '@prisma/client';
import { User } from './user.entity';

export type SalesRep = Omit<PrismaSalesRep, 'user'> & {
  user: User;
}; 