import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WSGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class FeedsService {
    constructor(private readonly prisma: PrismaClient, private readonly wsGateway: WSGateway) { }
    
    async create(postData: any) {
        const post = await this.prisma.feeds.create({
            data: {
                title: postData.title,
                videolink: postData.videolink,
                sublink: postData.sublink,
                issafe: postData.issafe,
                user: {
                    connect: {
                        id: postData.userId
                    }
                }
            }
        })
        return post
    }

    getAllPost(){
        return this.prisma.feeds.findMany({
            include: {
                user: true,
                likes: true,
                comments: true,
            }
        }).then(item => {
            return item.map(feeds => ({
                ...feeds, 
                user:{
                    username: feeds.user.username
                }
            }))
        });
    }

    getPost(id: string) {
        return this.prisma.feeds.findUnique({
            where: {
                id
            }
        })
    }

    async createLike(postData: any) {
        const post = await this.prisma.like.create({
            data: {
                feeds: {
                    connect: {
                        id: postData.feedsId
                    }
                },
                user: {
                    connect: {
                        id: postData.userId
                    }
                },
            }
        })
        return post
    }

    async deleteLike(postData: any) {
        const post = await this.prisma.like.deleteMany({
          where: {
              feedsId: postData.feedsId,
              userId: postData.userId,
          },
        });
        return post;
    }

    async getFeedsLiked(afeedsId: string, auserId: string) {
        const post = await this.prisma.like.findFirst({
          where: {
              feedsId: afeedsId,
              userId: auserId,
          },
        });
        return post;
    }

    async createComment(postData: any) {
        const post = await this.prisma.comment.create({
            data: {
                content: postData.content,
                feeds: {
                    connect: {
                        id: postData.feedsId
                    }
                },
                user: {
                    connect: {
                        id: postData.userId
                    }
                }
            }
        })
        return post
    }

    async createProgress(postData: any) {
        const post = await this.prisma.workProgress.create({
            data: {
                token : postData.token,
                judul : postData.judul,
                visibility  : postData.visibility,
                doHighlight : postData.doHighlight,
                doSubtitle : postData.doSubtitle,
                status : postData.status,
                videolink : postData.videolink,
                sublink : null,
                issafe : null,
                user: {
                    connect: {
                        id: postData.userId
                    }
                }
            }
        })
        return post
    }

    getUserProgress(id: string) {
        return this.prisma.workProgress.findMany({
            where: {
                userId: id
            }
        })
    }
    async updateProgress(updateData: any) {
        const update = await this.prisma.workProgress.update({
            where: { token: updateData.token},
            data: {
                status : updateData.status ,
                videolink : updateData.videolink,
                sublink : updateData.sublink,
                issafe : updateData.issafe,
            }
        })

        const userid = update.userId
        this.wsGateway.sendProgressUpdate(userid)

        return update
    }
}
