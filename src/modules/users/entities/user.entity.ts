import { Column, Entity, OneToMany, Unique } from "typeorm";
import { UserModel } from "src/models/user.model";
import { Appointment } from "src/modules/appointments/entities/appointment.entity";

export enum TypeUserEnum {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    DEFAULT = 'default',
    SHEPHERD = 'shepherd',
    MEMBER = 'member',
}

@Entity()
@Unique(['email'])
export class User extends UserModel {
    @Column({type: 'simple-enum', enum: TypeUserEnum, default: TypeUserEnum.DEFAULT})
    type: TypeUserEnum;

    @OneToMany(() => Appointment, appointment => appointment.responsible)
    appointments: Appointment[];
}
