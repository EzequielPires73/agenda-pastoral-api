import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DestinationNotification } from "../entities/notification.entity";

export class CreateNotificationDto {
    @ApiProperty()
    token: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    body: string;

    @ApiProperty()
    route: string;

    @ApiPropertyOptional()
    userId?: string;
    
    @ApiPropertyOptional()
    memberId?: string;

    @ApiPropertyOptional()
    destination?: DestinationNotification;

    @ApiPropertyOptional()
    appointmentId?: number;
}
