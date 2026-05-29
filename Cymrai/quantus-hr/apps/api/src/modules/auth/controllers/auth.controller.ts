import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const user = await this.authService.register(registerDto);
    // Remove password from response for security
    delete user.password;
    return res.status(HttpStatus.CREATED).json(user);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json(tokens);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const newTokens = await this.authService.refreshToken(req.user);
    return res.status(HttpStatus.OK).json(newTokens);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.user);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}