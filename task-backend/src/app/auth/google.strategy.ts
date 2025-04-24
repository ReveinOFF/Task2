import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('Google Profile:', profile);

    if (
      !profile?.emails ||
      !Array.isArray(profile.emails) ||
      profile.emails.length === 0
    ) {
      return done(new Error('No email found in Google profile'), null);
    }

    const { emails, id } = profile;
    const user = {
      email: emails[0].value,
      provider: 'google',
      providerId: id,
    };
    done(null, user);
  }
}
