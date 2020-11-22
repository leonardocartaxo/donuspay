import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    readonly _id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    cpf: string;
}
export class UserCreateOrUpdateDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    cpf: string;
}
