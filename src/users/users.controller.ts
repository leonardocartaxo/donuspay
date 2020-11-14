import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200,type: UserDto })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createUserDto: UserDto): Promise<UserDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiResponse({
        status: 200,
        type: [UserDto]
    })
    async findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
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

}
