import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TypeUserEnum } from "src/modules/users/entities/user.entity";

export class CreateMemberDto {
    @ApiProperty({default: 'Ezequiel Pires'})
    name: string;

    @ApiProperty({default: 'ezequiel.pires082000@gmail.com'})
    email: string;

    @ApiProperty({default: '(64) 99626-8117'})
    phone: string;

    @ApiProperty({default: '069.017.831-08'})
    cpf: string;

    @ApiPropertyOptional()
    avatar: string;

    @ApiProperty({default: '123456789'})
    password: string;

    @ApiPropertyOptional({default: false})
    deficiency: boolean;
}
