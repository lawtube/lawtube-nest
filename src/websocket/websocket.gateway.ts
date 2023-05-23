import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import { log } from 'console';

@WebSocketGateway({ cors: true })
export class WSGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  connectedClients: Socket[] = [];

  onModuleInit() {
    this.server.on('connection', client => {
      this.handleConnection(client);
      client.on('disconnect', () => this.handleDisconnect(client));
    });
  }

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    this.connectedClients.push(client);
    console.log("client connected")
  }

  handleDisconnect(client: Socket) {
    console.log("client disconnected")
    this.connectedClients = this.connectedClients.filter(c => c.id !== client.id);
  }

  @SubscribeMessage('broadcast')
  sendProgressUpdate(client: any, user: string): void {
    console.log("manggil fungsi ini", user)
    this.server.emit('broadcast', user);
    this.server.emit('message', user);
  }
}
