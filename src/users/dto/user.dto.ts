import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly cpf: string;
}
