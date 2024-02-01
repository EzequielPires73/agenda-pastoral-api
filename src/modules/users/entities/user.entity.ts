import { Column, Entity, OneToMany, Unique } from "typeorm";
import { UserModel } from "src/models/user.model";
import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Notification } from "src/modules/notifications/entities/notification.entity";

export enum TypeUserEnum {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    DEFAULT = 'default',
    SHEPHERD = 'shepherd',
    SHEPHERD_PRESIDENT = 'shepherd_president',
    MEMBER = 'member',
}

@Entity()
@Unique(['email'])
export class User extends UserModel {
    @Column({type: 'simple-enum', enum: TypeUserEnum, default: TypeUserEnum.DEFAULT})
    type: TypeUserEnum;

    @OneToMany(() => Appointment, appointment => appointment.responsible)
    appointments: Appointment[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification;
}
