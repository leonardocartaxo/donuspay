import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: UserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findById(id: string): Promise<User> {
        return this.userModel.findById(id);
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async update(id: string, userDto: UserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(
          userDto._id, userDto,
          {new: true}
          );
    }

    async delete(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id);
    }
}
