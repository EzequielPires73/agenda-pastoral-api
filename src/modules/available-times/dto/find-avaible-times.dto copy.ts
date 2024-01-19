import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindAvaibleTimesDto {
    @ApiPropertyOptional({default: 1})
    month: number;

    @ApiPropertyOptional({default: 2024})
    year: number;
}