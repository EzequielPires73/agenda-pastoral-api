import { ApiPropertyOptional } from "@nestjs/swagger";
import { TypeUserEnum } from "../entities/user.entity";

export class FindUserDto {
    @ApiPropertyOptional({default: TypeUserEnum.SHEPHERD})
    types?: string;
}