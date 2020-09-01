import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { AuthCredentialsDto } from './dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCreadentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCreadentials;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Username "${username}" already exist`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCreadentialsDto: AuthCredentialsDto,
  ): Promise<{ id: number; username: string }> {
    const { username, password } = authCreadentialsDto;

    const user = await this.findOne({ username: username });
    const isPasswordValid = await user?.validatePassword(password);

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
