import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const { email, password } = loginSchema.parse(body);

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const accessToken = this.jwtService.sign(
        { userId: user.id, email: user.email, role: user.role },
        { expiresIn: '1h' }
      );

      const refreshToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' }
      );

      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600,
        },
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException('Invalid input data', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      const { refreshToken } = refreshSchema.parse(body);

      const decoded = this.jwtService.verify(refreshToken) as { userId: string };

      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          expiresAt: { gt: new Date() },
        },
      });

      if (!storedToken) {
        throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      const newAccessToken = this.jwtService.sign(
        { userId: user.id, email: user.email, role: user.role },
        { expiresIn: '1h' }
      );

      const newRefreshToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' }
      );

      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      await this.prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: 3600,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException('Invalid input data', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    try {
      const { refreshToken } = refreshSchema.parse(body);

      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      return { message: 'Logged out successfully' };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException('Invalid input data', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
}

// Input validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
}); 