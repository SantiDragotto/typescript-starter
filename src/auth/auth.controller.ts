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
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user); // Generar un token JWT para el frontend
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
}