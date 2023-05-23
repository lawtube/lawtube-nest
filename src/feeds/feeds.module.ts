import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { PrismaClient } from '@prisma/client';
import { WSGateway } from 'src/websocket/websocket.gateway';

@Module({
  controllers: [FeedsController],
  providers: [FeedsService, PrismaClient, WSGateway]
})
export class FeedsModule {}
