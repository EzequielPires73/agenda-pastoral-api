import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindNotificationsDto {
    @ApiPropertyOptional()
    destination: string;
}