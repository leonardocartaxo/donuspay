import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserCreateOrUpdateDto, UserDto } from './userDto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200, type: UserDto })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createUserDto: UserCreateOrUpdateDto): Promise<UserDto> {
        return await this.usersService.create(createUserDto) as UserDto;
    }

    @Get()
    @ApiResponse({
        status: 200,
        type: [UserDto]
    })
    async findAll(): Promise<UserDto[]> {
        return await this.usersService.findAll() as UserDto[];
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'find user by Id',
        type: UserDto,
    })
    async findOne(@Param('id') id: string): Promise<UserDto> {
        return await this.usersService.findById(id) as UserDto;
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        description: 'update user by Id',
        type: UserCreateOrUpdateDto,
    })
    async update(
      @Param('id') id: string,
      @Body() userDto: UserCreateOrUpdateDto): Promise<UserDto> {
        return await this.usersService.update(id, userDto) as UserDto;
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
