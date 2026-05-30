import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GatewayService } from './gateway.service';

@WebSocketGateway({ namespace: '/ws' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private gatewayService: GatewayService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      client.data.userId = payload.sub;
      client.join(`user:${payload.sub}`);
    } catch (error) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      client.leave(`user:${userId}`);
    }
  }

  @SubscribeMessage('ping')
  async ping() {
    return 'pong';
  }
}