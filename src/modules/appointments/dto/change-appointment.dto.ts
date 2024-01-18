import { ApiProperty } from "@nestjs/swagger";
import { AppointmentStatus } from "../entities/appointment.entity";

export class ChangeAppointmentDto {
    @ApiProperty({default: AppointmentStatus.confirmado})
    status: AppointmentStatus;
}