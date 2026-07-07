import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import type { Response, Request } from 'express';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    private setRefreshCookie(
        res: Response,
        refreshToken: string,
    ){
        res.cookie("refreshToken", refreshToken,{
            httpOnly:true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    }

    @Post('register')
    async register(
          @Body() registerUserDto: RegisterDto,
          @Res({passthrough : true}) res: Response,
    ){
        const tokens = await this.authService.registerUser(registerUserDto);

        this.setRefreshCookie(
            res, 
            tokens.refreshToken,
        );
        return {
            accessToken: tokens.accessToken
        }
    }


    @Post('login')
    async login(
        @Body() loginUserDto: LoginDto,
        @Res({passthrough : true}) res: Response,

    ){
        const tokens = await this.authService.loginUser(loginUserDto);

        this.setRefreshCookie(
            res,
            tokens.refreshToken
        );

        return{
            accessToken : tokens.accessToken
        }
    }

    @UseGuards(AccessTokenGuard)
    @Get('profile')
    async getProfile(
        @CurrentUser() user: AuthenticatedUser,
    ){
        return user;
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refresh(
        // @Req() req: Request
        @CurrentUser() user: AuthenticatedUser,
        @Res({passthrough: true}) res: Response
    ){

        const tokens = await this.authService.refresh(user)

        this.setRefreshCookie(res, tokens.refreshToken);

        return {
            accessToken : tokens.accessToken,
        };

    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    async logout(
        @CurrentUser('id') userId: number,
        @Res({passthrough: true}) res: Response
    ){

        await this.authService.logout(userId)
        
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        return{
            message: "Logged out successfully"
        };

    }
}
