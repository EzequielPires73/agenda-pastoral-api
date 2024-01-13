import { AppointmentsCategory } from "src/modules/appointments-categories/entities/appointments-category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AppointmentsCategory, category => category.appointments)
    category: AppointmentsCategory;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time' })
    time: string;
}
