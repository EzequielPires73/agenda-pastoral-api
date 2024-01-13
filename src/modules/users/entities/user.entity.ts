import { Column, Entity } from "typeorm";
import { UserModel } from "src/models/user.model";

enum TypeUserEnum {
    admin = 'admin',
    superadmin = 'superadmin',
    default = 'default',
    shepherd = 'shepherd',
    member = 'member',
}

@Entity()
export class User extends UserModel {
    @Column({type: 'simple-enum', enum: TypeUserEnum, default: TypeUserEnum.default})
    type: TypeUserEnum;
}
