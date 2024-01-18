import { AppointmentsCategory } from "src/modules/appointments-categories/entities/appointments-category.entity";
import { Member } from "src/modules/members/entities/member.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum AppointmentStatus {
    pendente='pendente',
    confirmado='confirmado',
    finalizado='finalizado',
    declinado='declinado',
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AppointmentsCategory, category => category.appointments)
    category: AppointmentsCategory;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    observation: string;

    @Column({ type: 'time' })
    start: string;

    @Column({ type: 'time' })
    end: string;

    @Column({type: 'simple-enum', enum: AppointmentStatus, default: AppointmentStatus.pendente})
    status: AppointmentStatus;

    @ManyToOne(() => Member, member => member.appointments)
    member: Member;

    @ManyToOne(() => User, user => user.appointments)
    responsible: User;
}
