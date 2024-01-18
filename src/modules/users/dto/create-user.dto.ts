import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TypeUserEnum } from "../entities/user.entity";

export class CreateUserDto {
    @ApiProperty({default: 'Ezequiel Pires'})
    name: string;

    @ApiProperty({default: 'ezequiel.pires082000@gmail.com'})
    email: string;

    @ApiProperty({default: '(64) 99626-8117'})
    phone: string;

    @ApiPropertyOptional()
    avatar: string;

    @ApiProperty({default: '123456789'})
    password: string;

    @ApiProperty({default: TypeUserEnum.ADMIN, enum: TypeUserEnum})
    type: TypeUserEnum;
}
