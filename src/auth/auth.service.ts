/* eslint-disable @typescript-eslint/no-unused-vars */
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const matchedUser = await this.usersService.findOneByEmail(email, true);
    if (!matchedUser) {
      return null;
    }
    const { password: hashedPassword, ...otherInfo } = matchedUser;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch ? otherInfo : null;
  }

  async register(user: any) {
    const hash = await bcrypt.hash(user.password, saltRounds);
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new UnauthorizedException(
        'User Already Exists, please login to continue',
      );
    }
    const createdUser = await this.usersService.create({
      ...user,
      password: hash,
      userName: user.username,
      userId: uuidv4(),
    });

    const { password, ...otherInfo } = createdUser.toJSON();

    const payload = { email: createdUser.email, userId: createdUser.userId };
    return {
      access_token: this.jwtService.sign(payload),
      ...otherInfo,
    };
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user.userId };
    const existingUser = await this.usersService.findOneByEmail(user.email);
    console.log('Existing User', existingUser);

    if (!existingUser) {
      throw new UnauthorizedException(
        'The user is not available, please register',
      );
    }

    return {
      access_token: this.jwtService.sign(payload),
      ...existingUser,
    };
  }
}
