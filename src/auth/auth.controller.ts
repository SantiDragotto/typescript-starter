import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {
    // Redirige a Google para autenticación
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'No user from Google' });
    }

    // Guardar en la base de datos
    await this.authService.googleLogin(req);

    // Generar el token JWT
    const token = this.authService.generateJwt(req.user);

    // Redirigir al frontend con el token JWT
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
}