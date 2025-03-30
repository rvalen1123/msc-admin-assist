import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  passwordHash: string;
}

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'passwordHash'>) {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
      },
    };
  }

  async refreshToken(user: Omit<User, 'passwordHash'>) {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async findUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findById(id);
    if (!user) {
      return null;
    }
    const { passwordHash, ...result } = user;
    return result;
  }
} 