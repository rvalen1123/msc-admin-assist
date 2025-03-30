import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SalesRep } from './entities/sales-rep.entity';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Omit<User, 'salesRep'>> {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: { salesRep: false }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<Omit<User, 'salesRep'> | null> {
    return this.prisma.user.findUnique({ 
      where: { email },
      include: { salesRep: false }
    });
  }

  async create(userData: {
    email: string;
    password: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
  }): Promise<Omit<User, 'salesRep'>> {
    const passwordHash = await this.hashPassword(userData.password);
    return this.prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        role: userData.role || UserRole.CUSTOMER,
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company,
      },
      include: { salesRep: false }
    });
  }

  async createSalesRep(userId: string, salesRepData: {
    territory?: string;
    region?: string;
    active?: boolean;
  }): Promise<SalesRep> {
    return this.prisma.salesRep.create({
      data: {
        ...salesRepData,
        userId,
      },
      include: { user: true }
    });
  }

  async update(id: string, updateData: {
    email?: string;
    password?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
  }): Promise<Omit<User, 'salesRep'>> {
    const data: any = { ...updateData };
    if (updateData.password) {
      data.passwordHash = await this.hashPassword(updateData.password);
      delete data.password;
    }
    return this.prisma.user.update({
      where: { id },
      data,
      include: { salesRep: false }
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
} 