import { UserModel } from "src/models/user.model";
import { Column, Entity } from "typeorm";

@Entity()
export class Member extends UserModel {
    @Column({nullable: true})
    cpf: string;

    @Column({nullable: true})
    deficiency: boolean;
}
