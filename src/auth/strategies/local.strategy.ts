import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';

import { UserRepository } from '../user.repository';
import { AuthCredentialsDto } from '../dto';

@Injectable()
export class LocalStartegy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    const authcreadentials: AuthCredentialsDto = {
      username: username,
      password: password,
    };

    const user = await this.userRepository.validateUserPassword(
      authcreadentials,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
