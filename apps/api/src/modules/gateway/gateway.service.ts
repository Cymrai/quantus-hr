import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewayService {
  private server: Server;

  constructor(private configService: ConfigService) {}

  setServer(server: Server): void {
    this.server = server;
  }

  emitToUser(userId: string, event: string, data: any): void {
    const room = `user:${userId}`;
    if (this.server) {
      this.server.to(room).emit(event, data);
    } else {
      console.error('Socket server not initialized.');
    }
  }
}