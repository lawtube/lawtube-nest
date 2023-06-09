import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { FeedsModule } from './feeds/feeds.module';
import { WSGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    FeedsModule,
  ],
  providers: [PrismaClient, WSGateway]
})
export class AppModule {}
