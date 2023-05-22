import { Controller, Get, Post, Body, HttpException, HttpStatus, Put, Param, Delete } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
    constructor(private feedsService: FeedsService) { }

    @Post('create')
    async create(@Body() body: any) {
        try {
            return await this.feedsService.create(body)
        } catch (e: any) {
            if (e instanceof PrismaClientKnownRequestError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Invalid post payload"
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "An error occurred while creating post"

                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    @Post('createLike')
    async createLike(@Body() body: any) {
        try {
            return await this.feedsService.createLike(body)
        } catch (e: any) {
            if (e instanceof PrismaClientKnownRequestError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Invalid post payload"
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "An error occurred while like"

                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    @Delete('deleteLike')
    async deleteLike(@Body() body: any) {
        try {
            return await this.feedsService.deleteLike(body)
        } catch (e: any) {
            if (e instanceof PrismaClientKnownRequestError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Invalid post payload"
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "An error occurred while like"

                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    @Get()
    getAllPost() {
        return this.feedsService.getAllPost();
    }

    @Get('like/:feedsId/:userId')
    getFeedsLiked(@Param('feedsId') feedsId: string, @Param('userId') userId: string) {
        return this.feedsService.getFeedsLiked(feedsId,userId);
    }
    

    @Post('createProgress')
    async createProgress(@Body() body: any) {
        try {
            return await this.feedsService.createProgress(body)
        } catch (e: any) {
            if (e instanceof PrismaClientKnownRequestError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Invalid post payload"
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "An error occurred while creating post"

                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    @Get('progress/:id')
    getUserProgress(@Param('id') id: string) {
        return this.feedsService.getUserProgress(id);
    }


    @Put('updateProgress')
    async updateProgress(@Body() body: any) {
        return await this.feedsService.updateProgress(body)
    }

    
}
