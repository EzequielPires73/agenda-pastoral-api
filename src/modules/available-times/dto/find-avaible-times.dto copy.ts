import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindAvaibleTimesDto {
    @ApiPropertyOptional({default: '2024-01-26'})
    date: string;
    
    @ApiPropertyOptional({default: 1})
    month: number;

    @ApiPropertyOptional({default: 2024})
    year: number;
}