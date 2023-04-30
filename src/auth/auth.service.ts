
import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { TokenData, RegistrationDataDTO } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<TokenData> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      return {
        token:
          'Bearer ' +
          this.jwtService.sign({
            id: user.id,
            username: user.username,
          }),

      };
    }
    throw new Error('Invalid username or password');
  }

  async register(userData: RegistrationDataDTO) {
    const user = await this.prisma.user.create({
      data: {
        username: userData.username,
        password: bcrypt.hashSync(userData.password, 10),
        email: userData.email,
      },
    });
    return { status: `Berhasil Membuat akun dengan username ${user.username}`};
  }

  async getUserDetails(token: string){
    const decodedToken = await this.jwtService.verifyAsync(token);
    const isTokenBlacklisted = await this.prisma.tokenBlacklist.findUnique({
      where: {
        token: token,
      },
    });

    if (isTokenBlacklisted) {
      return {status: "Token tidak valid"};
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });
  
    if (user) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } else {
      throw new Error('User not found');
    }
  }
  async logout (token: string){
    await this.prisma.tokenBlacklist.create({
      data: {
        token: token,
      },
    });
    return { status: "Berhasil Logout"};
  }
  
}