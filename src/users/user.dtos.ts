import { ApiProperty } from '@nestjs/swagger';

export class UserDtos {
    @ApiProperty()
    readonly _id: string;
    @ApiProperty()
    readonly created_at: Date;
    @ApiProperty()
    readonly updated_at: Date;
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
