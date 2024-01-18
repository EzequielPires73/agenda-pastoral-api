import { ApiProperty } from "@nestjs/swagger";

export class CreateAppointmentDto {
    @ApiProperty({default: 1})
    categoryId: number;

    @ApiProperty({default: 'Busco orientação pastoral em relação a uma questão familiar e gostaria de receber aconselhamento.'})
    observation: string;

    @ApiProperty({default: '2024-01-17'})
    date: Date;

    @ApiProperty({default: '08:00:00'})
    start: string;
    
    @ApiProperty({default: '812e3011-6eeb-4f44-83b0-1ecc43b1ddfa'})
    memberId: string;

    @ApiProperty()
    responsibleId: string;
}
