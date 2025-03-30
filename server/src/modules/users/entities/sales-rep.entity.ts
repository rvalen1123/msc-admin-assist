import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('sales_reps')
export class SalesRep {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column({ unique: true })
  userId: string;

  @ApiProperty({ example: 'Northeast' })
  @Column({ nullable: true })
  territory: string;

  @ApiProperty({ example: 'New York' })
  @Column({ nullable: true })
  region: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  active: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, user => user.salesRep)
  @JoinColumn({ name: 'userId' })
  user: User;
} 