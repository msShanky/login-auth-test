import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/db/schemas/user.schema';
import { CreateUserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByUserName(userName: string): Promise<User | undefined> {
    // return this.userModel.findOne((user) => user.userName === userName);
    return this.userModel.findOne({ userName }, 'userId email userName');
  }

  async findOneByEmail(
    email: string,
    shouldIncludePassword = false,
  ): Promise<User> {
    const userFound = await this.userModel
      .findOne({ email }, !shouldIncludePassword && 'userId email userName')
      .exec();
    return userFound ? userFound.toJSON() : userFound;
  }

  async create(createCatDto: CreateUserDTO) {
    const createdUser = new this.userModel(createCatDto);
    return createdUser.save();
  }
}
