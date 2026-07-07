import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express'
import { RefreshTokenPayload } from '../interfaces/refreshToken-payload.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {

  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies.refreshToken,
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true
      // normally validate(payload) 
      // but passReqToCallback => validate(req, payload)
    });
  }

  async validate(req: Request, payload: RefreshTokenPayload) {

    const refreshToken = req.cookies.refreshToken

    const user = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    // returning first and last name for consistency for authenticated interface
  }

}
