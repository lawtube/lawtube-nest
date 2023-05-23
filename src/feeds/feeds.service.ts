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
                comments: {
                    include: {
                        user: true
                    }
                }
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
        return {
            status: 201,
            message: "Berhasil menambahkan ke work progress"
        }
    }

    async getUserProgress(id: string) {
        const progress = await this.prisma.workProgress.findMany({
            where: {
                userId: id
            }
        })
        console.log(progress)
        return {
            status: 200,
            data: progress
        }
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
        this.wsGateway.sendProgressUpdate(null, userid)

        if(update.status === "finish moderation"){
            const sublink = update.doSubtitle ? update.sublink : null
            const postData = {
                title : update.judul,
                videolink : update.videolink,
                sublink : sublink,
                issafe : update.issafe,
                userId : update.userId
            }

            this.create(postData)
        }

        return {
            status: 200,
            message: "Berhasil update work progress"
        }
    }
}
