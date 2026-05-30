import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { GatewayService } from './gateway.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
  ],
  providers: [AppGateway, GatewayService],
})
export class GatewayModule {}