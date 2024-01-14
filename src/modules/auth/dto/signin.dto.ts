import {ApiProperty} from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({default: 'ezequiel.pires082000@gmail.com'})
    email: string;

    @ApiProperty({default: '123456789'})
    password: string;
}