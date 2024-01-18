import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AvailableTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: Date;
    
    @Column({ type: 'time' })
    start: string;
    
    @Column({ type: 'time' })
    end: string;
}
