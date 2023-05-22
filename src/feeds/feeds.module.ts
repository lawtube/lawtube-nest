import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [FeedsController],
  providers: [FeedsService, PrismaClient]
})
export class FeedsModule {}
