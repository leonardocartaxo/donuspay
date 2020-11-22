import { Body, Controller, Get, Put, Param, Post, Delete } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserCreateOrUpdateDto, UserDtos } from './user.dtos';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200, type: UserDtos })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createUserDto: UserCreateOrUpdateDto): Promise<UserDtos> {
        return await this.usersService.create(createUserDto) as UserDtos;
    }

    @Get()
    @ApiResponse({
        status: 200,
        type: [UserDtos]
    })
    async findAll(): Promise<UserDtos[]> {
        return await this.usersService.findAll() as UserDtos[];
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'find user by Id',
        type: UserDtos,
    })
    async findOne(@Param('id') id: string): Promise<UserDtos> {
        return await this.usersService.findById(id) as UserDtos;
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        description: 'update user by Id',
        type: UserCreateOrUpdateDto,
    })
    async update(
      @Param('id') id: string,
      @Body() userDto: UserCreateOrUpdateDto): Promise<UserDtos> {
        return await this.usersService.update(id, userDto) as UserDtos;
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'delete user by Id',
    })
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
