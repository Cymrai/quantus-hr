/**
 * @file local-auth.guard.ts
 * @description Guard for protecting routes that require local authentication, such as login.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}