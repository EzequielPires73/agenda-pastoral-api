import { UserModel } from "src/models/user.model";
import { Column, Entity, Unique } from "typeorm";

@Entity()
@Unique(['email', 'cpf'])
export class Member extends UserModel {
    @Column({nullable: true})
    cpf: string;

    @Column({nullable: true})
    deficiency: boolean;
}
