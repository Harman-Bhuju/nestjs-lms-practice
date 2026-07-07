import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../interfaces/accessToken-payload.interface';


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {

  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_SECRET')
    });
  }

  async validate(payload: AccessTokenPayload) {

    const user = await this.authService.validateAccessToken(
      payload.sub,
      payload.email,
      payload.role,
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
  }


  // Passport automatically calls validate() after:
  // 1. Extracting the JWT using jwtFromRequest.
  // 2. Verifying the JWT signature using secretOrKey.
  // 3. Decoding the payload.
  //
  // The object returned from validate() is automatically assigned
  // to request.user by Passport before the controller is executed.

}
