import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import type { Response, Request } from 'express';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    private setRefreshCookie(
        res: Response,
        refreshToken: string,
    ) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    }

    @ApiOperation({
        summary: 'Register a new account',
        description: 'Creates a new user account and returns an access token.',
    })
    @ApiCreatedResponse({
        description: 'Account registered successfully',
        type: AuthResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid registration data',
    })
    @Post('register')
    async register(
        @Body() registerUserDto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.registerUser(registerUserDto);

        this.setRefreshCookie(
            res,
            tokens.refreshToken,
        );
        return {
            accessToken: tokens.accessToken
        }
    }

    @ApiOperation({
        summary: 'Login to an existing account',
        description: 'Authenticates a user and returns an access token.',
    })
    @ApiOkResponse({
        description: 'Login successful',
        type: AuthResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid email or password',
    })
    @ApiBadRequestResponse({
        description: 'Invalid login data',
    })
    @Post('login')
    async login(
        @Body() loginUserDto: LoginDto,
        @Res({ passthrough: true }) res: Response,

    ) {
        const tokens = await this.authService.loginUser(loginUserDto);

        this.setRefreshCookie(
            res,
            tokens.refreshToken
        );

        return {
            accessToken: tokens.accessToken
        }
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current user profile',
    })
    @ApiOkResponse({
        description: 'Current user profile',
        type: ProfileResponseDto
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or missing access token',
    })
    @UseGuards(AccessTokenGuard)
    @Get('profile')
    async getProfile(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return user;
    }

    @ApiCookieAuth('refreshToken')
    @ApiOperation({
        summary: 'Refresh access token',
        description:
            'Generates a new access token using the refresh token stored in the HTTP-only cookie.',
    })
    @ApiOkResponse({
        description: 'Access token refreshed successfully',
        type: AuthResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid, expired, or missing refresh token',
    })
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refresh(
        // @Req() req: Request
        @CurrentUser() user: AuthenticatedUser,
        @Res({ passthrough: true }) res: Response
    ) {

        const tokens = await this.authService.refresh(user)

        this.setRefreshCookie(res, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
        };

    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Logout from the current account',
        description:
            'Invalidates the refresh token and clears the refresh token cookie.',
    })
    @ApiOkResponse({
        description: 'Logged out successfully',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or missing access token',
    })
    @UseGuards(AccessTokenGuard)
    @Post('logout')
    async logout(
        @CurrentUser('id') userId: number,
        @Res({ passthrough: true }) res: Response
    ) {

        await this.authService.logout(userId)

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        return {
            message: "Logged out successfully"
        };

    }
}
