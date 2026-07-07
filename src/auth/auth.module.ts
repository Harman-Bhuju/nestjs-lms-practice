import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RolesGuard } from './guards/role.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) =>({
        secret: configService.getOrThrow('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
          }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
    RolesGuard
  ]
})
export class AuthModule {}
