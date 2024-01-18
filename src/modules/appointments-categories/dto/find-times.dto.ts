import { ApiProperty } from "@nestjs/swagger";

export class FindTimesDto {
    @ApiProperty({default: '2024-01-17'})
    date: string;
}