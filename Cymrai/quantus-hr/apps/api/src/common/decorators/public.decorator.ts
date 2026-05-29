/**
 * @file public.decorator.ts
 * @description Decorator to mark routes as publicly accessible, bypassing JWT authentication.
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);