import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Member } from "src/modules/members/entities/member.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum DestinationNotification {
    USER='user',
    MEMBER='member',
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'simple-enum', enum: DestinationNotification, default: DestinationNotification.USER})
    destination: DestinationNotification;

    @Column()
    title: string;
    
    @Column()
    body: string; 

    @Column()
    route: string;

    @ManyToOne(() => User, user => user.notifications)
    user: User;

    @ManyToOne(() => Member, member => member.notifications)
    member: Member;
    
    @ManyToOne(() => Appointment, appointment => appointment.notifications)
    appointment: Appointment;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
