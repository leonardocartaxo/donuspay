import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    readonly _id: string;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly cpf: string;
}
