import { ApiProperty } from "@nestjs/swagger";

export class CreateAvailableTimeDto {
    @ApiProperty()
    date: Date;
    
    @ApiProperty()
    start: string;
    
    @ApiProperty()
    end: string;
}
