import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRepository } from '../user.repository';
import { JwtPayload } from '../interfaces';
import { User } from '../user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'my_secret123456789',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub } = payload;

    const user = await this.userRepository.findOne({ id: sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
