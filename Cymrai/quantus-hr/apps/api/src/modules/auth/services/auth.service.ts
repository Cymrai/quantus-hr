import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model';

export class AuthService {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'defaultSecret';
  }

  async login(email: string, password: string): Promise<string | null> {
    try {
      // Find user by email
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, this.secretKey, { expiresIn: '1h' });
      return token;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Internal server error');
    }
  }
}