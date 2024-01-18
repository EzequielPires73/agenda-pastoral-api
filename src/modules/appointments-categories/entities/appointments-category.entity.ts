import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class AppointmentsCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    duration: number;

    @OneToMany(() => Appointment, appointment => appointment.category)
    appointments: Appointment[];
}
