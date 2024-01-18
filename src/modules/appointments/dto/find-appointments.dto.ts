import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FindAppointmentsDto {
    @ApiPropertyOptional({default: null})
    memberId: string;

    @ApiPropertyOptional({default: '2024-01-18'})
    date: Date;

    @ApiPropertyOptional({default: 1})
    month: number;

    @ApiPropertyOptional({default: 2024})
    year: number;
}