import { ApiProperty } from "@nestjs/swagger";

export class CreateAppointmentsCategoryDto {
    @ApiProperty({default: 'Aconselhamento Pastoral'})
    name: string;

    @ApiProperty({default: 60})
    duration: number;
}
