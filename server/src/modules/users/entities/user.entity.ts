import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { SalesRep } from './sales-rep.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty({ example: 'John' })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({ example: 'Acme Corp' })
  @Column({ nullable: true })
  company: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => SalesRep, salesRep => salesRep.user)
  @JoinColumn()
  salesRep: SalesRep;
} 