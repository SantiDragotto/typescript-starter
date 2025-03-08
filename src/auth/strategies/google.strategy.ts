import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
      passReqToCallback: true
    });
  }

  authorizationParams(): Record<string, string> {
    return {
      prompt: 'consent', // ⬅️ Ahora está en el lugar correcto
      access_type: 'offline', // ⬅️ Esto permite obtener un refreshToken
    };
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    console.log('Google Profile:', profile);

    // Verificar que `emails` exista antes de acceder a `emails[0].value`
    const email = profile.emails?.[0]?.value || null;
    if (!email) {
      console.error('No se recibió un email en el perfil de Google.');
      return done(new Error('No email received from Google'), null);
    }

    const user = {
      email,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      picture: profile.photos?.[0]?.value || '',
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}