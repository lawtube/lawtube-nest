
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

  async login(username: string, password: string): Promise<{status: number, message: string, data?: TokenData}> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  
    if (user && bcrypt.compareSync(password, user.password)) {
      return {
        status: 200,
        message: 'Login berhasil',
        data: {
          token:
            'Bearer ' +
            this.jwtService.sign({
              id: user.id,
              username: user.username,
            }),
        },
      };
    } else {
      return {
        status: 401,
        message: 'Username atau password salah',
      };
    }
  }
  

  async register(userData: RegistrationDataDTO) {
    // check if email or username already exist
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });
  
    if (existingUser) {
      return {
        status: 400,
        message: existingUser.username === userData.username
          ? 'Username sudah pernah digunakan' 
          : 'Email sudah pernah digunakan',
      };
    }

    // create new user
    const user = await this.prisma.user.create({
      data: {
        username: userData.username,
        password: bcrypt.hashSync(userData.password, 10),
        email: userData.email,
      },
    });
    return {
      status: 201,
      message: `Berhasil membuat akun dengan username ${user.username}`,
    };
  }
  

  async getUserDetails(token: string){
    if(token=="notvalid"){
      return {
        status: 401,
        message: "User not authorized"
      };
    }
    const decodedToken = await this.jwtService.verifyAsync(token);
    const isTokenBlacklisted = await this.prisma.tokenBlacklist.findUnique({
      where: {
        token: token,
      },
    });

    if (isTokenBlacklisted) {
      return {
        status: 401,
        message: "Token tidak valid"
      };
    }
    
    const user = await this.prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });
  
    if (user) {
      return {
        status: 200,
        data: { 
          id: user.id,
          username: user.username,
          email: user.email
        }
      };
    } 
  }
  async logout (token: string){
    await this.prisma.tokenBlacklist.create({
      data: {
        token: token,
      },
    });
    return { 
      status: 200 ,
      message: "Berhasil Logout"
    };
  }
  
}