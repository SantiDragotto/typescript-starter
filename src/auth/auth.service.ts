import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async googleLogin(req) {
    if (!req.user) return 'No user from Google';

    const { email, accessToken, refreshToken } = req.user;

    console.log(req.user)

    // Guardar en la base de datos
    await this.prisma.userToken.upsert({
      where: { userId: email },
      update: { accessToken, refreshToken, expiresAt: new Date(Date.now() + 3600 * 1000) },
      create: { userId: email, provider: 'google', accessToken, refreshToken, expiresAt: new Date(Date.now() + 3600 * 1000) },
    });

    return { message: 'User authenticated', user: req.user };
  }

  generateJwt(user) {
    return this.jwtService.sign({ email: user.email, name: user.firstName });
  }
}