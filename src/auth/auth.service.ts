import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/loginUser.dto';
import { Role } from 'src/user/enum/user.enum';
import { AccessTokenPayload } from './interfaces/accessToken-payload.interface';
import { RefreshTokenPayload } from './interfaces/refreshToken-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    private async generateTokens(user: Pick<User, 'id' | 'email' | 'role'>) {

        const accessPayload: AccessTokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const refreshPayload: RefreshTokenPayload = {
            id: user.id,
        }

        const accessToken = await this.jwtService.signAsync(accessPayload)


        const refreshToken = await this.jwtService.signAsync(refreshPayload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        })

        return {
            accessToken,
            refreshToken
        };
    }

    async registerUser(registerUserDto: RegisterDto) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(
            registerUserDto.password, saltRounds
        );

        const user = await this.userService.create({ ...registerUserDto, password: hash });


        const tokens = await this.generateTokens(user);
        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10)

        await this.userService.updateRefreshToken(
            user.id,
            hashedRefreshToken
        )

        return tokens;
    }

    async loginUser(loginUserDto: LoginDto) {
        const user = await this.userService.findByEmail(loginUserDto.email)

        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(
            loginUserDto.password, user.password
        )

        if (!isMatch) {
            throw new UnauthorizedException("invalid email or password")
        }

        const tokens = await this.generateTokens(user);

        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

        await this.userService.updateRefreshToken(
            user.id,
            hashedRefreshToken,
        );

        return tokens;
    }

    async validateAccessToken(
        id: number,
        email: string,
        role: Role) {

        return await this.userService.getUser(
            id,
            email,
            role
        )

    }

    async validateRefreshToken(id: number, refreshToken: string){

        const user = await this.userService.findById(id);

        if(!user){
            return null
        }
        if(!user.refreshToken) return null;

        const isMatch = await bcrypt.compare(
            refreshToken, 
            user.refreshToken
        );

        return isMatch ? user : null;
    }

    async refresh(user: Pick<User,'id'|'email'|'role'>){
        const tokens = await this.generateTokens(user);

        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

        await this.userService.updateRefreshToken(
            user.id,
            hashedRefreshToken,
        );

        return tokens;
    }

    async logout(id: number){
        await this.userService.updateRefreshToken(
            id,
            null
        );
    }
}
