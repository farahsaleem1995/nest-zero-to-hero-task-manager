import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto';
import { LoaclAuthGuard } from './guards/local-auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { JwtPayload } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('sign-up')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('sign-in')
  @UseGuards(LoaclAuthGuard)
  async signIn(@GetUser() user: User): Promise<{ accessToken: string }> {
    const payload: JwtPayload = { sub: user.id, username: user.username };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken: accessToken };
  }
}
