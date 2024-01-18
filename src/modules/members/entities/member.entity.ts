import { UserModel } from "src/models/user.model";
import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Column, Entity, OneToMany, Unique } from "typeorm";

@Entity()
@Unique(['email', 'cpf'])
export class Member extends UserModel {
    @Column({nullable: true})
    cpf: string;

    @Column({nullable: true})
    deficiency: boolean;

    @OneToMany(() => Appointment, appointment => appointment.member)
    appointments: Appointment[];
}
