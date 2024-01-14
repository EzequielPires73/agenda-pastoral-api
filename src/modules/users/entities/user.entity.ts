import { Column, Entity, Unique } from "typeorm";
import { UserModel } from "src/models/user.model";

export enum TypeUserEnum {
    admin = 'admin',
    superadmin = 'superadmin',
    default = 'default',
    shepherd = 'shepherd',
    member = 'member',
}

@Entity()
@Unique(['email'])
export class User extends UserModel {
    @Column({type: 'simple-enum', enum: TypeUserEnum, default: TypeUserEnum.default})
    type: TypeUserEnum;
}
