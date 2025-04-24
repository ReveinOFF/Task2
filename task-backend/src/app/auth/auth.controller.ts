import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignDTO } from 'src/core/dto/auth.dto';
import { GoogleOauthGuard } from 'src/core/guard/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() dto: SignDTO) {
    return await this.authService.login(dto);
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() dto: SignDTO) {
    return await this.authService.registration(dto);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req) {
    return await this.authService.googleLogin(req.user);
  }
}
