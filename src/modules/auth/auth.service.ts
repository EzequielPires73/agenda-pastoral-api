import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MembersService } from '../members/members.service';
import { TypeUserEnum } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private membersService: MembersService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if(!user) throw new UnauthorizedException();
        
        const passwordHash = compareSync(pass, user.password);
        if (!passwordHash) throw new UnauthorizedException();

        const { password, ...result } = user;
        const payload = {
            sub: user.id,
            ...result
        }

        return {
            success: true,
            user: result,
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    
    async signInMember(email: string, pass: string): Promise<any> {
        const user = await this.membersService.findOneByEmail(email);
        if(!user) throw new UnauthorizedException();
        
        const passwordHash = compareSync(pass, user.password);
        if (!passwordHash) throw new UnauthorizedException();

        const { password, ...result } = user;
        const payload = {
            sub: user.id,
            type: TypeUserEnum.MEMBER,
            ...result
        }

        return {
            success: true,
            user: {...result, type: TypeUserEnum.MEMBER,},
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
