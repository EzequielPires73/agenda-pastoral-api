import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AppointmentStatus } from "../entities/appointment.entity";

export class FindAppointmentsDto {
    @ApiPropertyOptional({default: null})
    memberId: string;

    @ApiPropertyOptional({default: '2024-01-18'})
    date: Date;

    @ApiPropertyOptional({default: 1})
    month: number;

    @ApiPropertyOptional({default: 2024})
    year: number;

    @ApiPropertyOptional({default: AppointmentStatus.pendente})
    status: string;
}