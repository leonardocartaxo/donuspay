import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { UserCreateOrUpdateDto } from './user.dtos';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: UserCreateOrUpdateDto): Promise<User> {
        try {
            const createdUser = new this.userModel(createUserDto);
            return await createdUser.save();
        } catch (error) {
            if (error?.name === 'MongoError' && error?.code === 11000)
                throw new BadRequestException(error.message);
            else throw error;
        }
    }

    async findById(id: string): Promise<User> {
        return this.userModel.findById(id);
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find();
    }

    async update(id: string, userDto: UserCreateOrUpdateDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, userDto,{new: true});
    }

    async delete(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id);
    }
}
