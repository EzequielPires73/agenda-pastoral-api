import { UserModel } from "src/models/user.model";
import { AvailableTime } from "src/modules/available-times/entities/available-time.entity";
import { Entity, OneToMany } from "typeorm";

@Entity()
export class Shepherd extends UserModel {
    @OneToMany(() => AvailableTime, availableTime => availableTime.shepherd)
    availableTimes: AvailableTime[];
}
