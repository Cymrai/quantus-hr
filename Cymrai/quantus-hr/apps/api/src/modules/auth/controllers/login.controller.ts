import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validateLoginInput } from '../validators/login.validator';

export class LoginController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    try {
      // Validate input
      const { error, value } = validateLoginInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      // Call service to handle login logic
      const token = await this.authService.login(value.email, value.password);
      if (!token) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Return the token in the response
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}