/**
 * @file jwt-auth.guard.ts
 * @description Guard for protecting routes that require JWT authentication, such as profile access.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}