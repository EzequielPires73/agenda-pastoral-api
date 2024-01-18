import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('login/members')
    signInMembers(@Body() signInDto: SignInDto) {
        return this.authService.signInMember(signInDto.email, signInDto.password);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
