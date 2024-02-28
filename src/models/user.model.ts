import { hashSync } from "bcrypt";
import { BeforeInsert, Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class UserModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;
    
    @Column()
    phone: string;

    @Column({nullable: true})
    avatar: string;
    
    @Column()
    password: string;

    @Column({nullable: true})
    notificationToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    hashPassword() {
        this.password = hashSync(this.password, 10);
    }
}