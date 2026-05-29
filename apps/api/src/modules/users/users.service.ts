import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  adminOnly() {
    return 'This is an admin-only endpoint.';
  }
}