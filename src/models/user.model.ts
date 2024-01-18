import { hashSync } from "bcrypt";
import { BeforeInsert, Column, PrimaryGeneratedColumn } from "typeorm";

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

    @BeforeInsert()
    hashPassword() {
        this.password = hashSync(this.password, 10);
    }
}