import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import { log } from 'console';

@WebSocketGateway()
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

  handleConnection(client: Socket) {
    this.connectedClients.push(client);
  }

  // handleConnection(client: Socket) {
  //   const user = client.handshake.query.user;
  //   console.log(`User ${user} connected`);

  //   // Handle the connection within the user's namespace
  //   const namespace = this.server.of(`/${user}`);
  //   namespace.on('connection', (socket) => {
  //     console.log(`User ${user} connected to the namespace`);

  //     socket.on('disconnect', () => {
  //       console.log(`User ${user} disconnected from the namespace`);
  //     });
  //   });
  // }

  handleDisconnect(client: Socket) {
    this.connectedClients = this.connectedClients.filter(c => c.id !== client.id);
  }

  @SubscribeMessage('broadcastMessage')
  handleBroadcastMessage(client: Socket, message: string) {
    Logger.log(message)
    this.server.emit('broadcastMessage', message); // Broadcast the message to all connected clients
  }

  sendProgressUpdate(user: string): void {
    console.log("manggil fungsi ini", user)
    this.server.emit('onMessage', user);
  }
}
