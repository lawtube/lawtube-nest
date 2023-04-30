import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { RegistrationDataDTO } from './auth.types';
import { AuthService } from './auth.service';
import { AuthToken } from './auth.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('user')
    async getUserDetails(@AuthToken() token: string): Promise<Partial<User>> {
        return this.authService.getUserDetails(token);
    }

    @Post('logout')
    async logout(@AuthToken() token: string) {
        return this.authService.logout(token);
    }
      
      

    @Post('register')
    async register(
        @Body() userData: RegistrationDataDTO,
    ) {
        try {
            return await this.authService.register(userData);
        } catch (e: any) {
        throw new HttpException(
            {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e.message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
        }
    }

    @Post('login')
    async login(@Res({ passthrough: true }) response: any, @Body() body: any) {
        try {
        const tokenData = await this.authService.login(
            body.username,
            body.password,
        );
        response.cookie('token', tokenData.token, {
            maxAge: 900000 * 16,
            httpOnly: false,
        });
        return tokenData;
        } catch (e: any) {
        throw new HttpException(
            {
            status: HttpStatus.FORBIDDEN,
            error: e.message,
            },
            HttpStatus.FORBIDDEN,
        );
        }
    }
}
