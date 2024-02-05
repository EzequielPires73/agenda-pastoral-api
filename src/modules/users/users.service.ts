import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeUserEnum, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>
  ) {
    this.verifySuperAdmin();
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const result = await this.repository.findOneBy({ email: createUserDto.email });
      if (result) throw new Error(`Usuário com o email ${createUserDto.email} já existe.`);

      const user = this.repository.create(createUserDto);

      return {
        success: true,
        result: await this.repository.save(user)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(queryDto?: FindUserDto) {
    try {
      const types = queryDto.types && queryDto.types != "null" ? queryDto.types.split(',').map(item => item.trim()) : null;

      const query = this.repository.createQueryBuilder("user");
      { types ? query.andWhere('user.type IN (:...types)', { types: types }) : null }

      const [results, total] = await query.getManyAndCount();

      return {
        success: true,
        results,
        total
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.repository.findOneBy({ id });

      if (!result) throw new Error('Usuário não foi encontrado.');

      return {
        success: true,
        result,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async pushNotificationToken(notificationToken: string, user: any) {
    try {
      const result = await this.repository.findOneBy({ id: user.id });
      if (!result) throw new Error('Usuário não foi encontrado.');

      await this.repository.update(result.id, { notificationToken: notificationToken ?? null });

      return {
        success: true,
        message: 'Token registrado com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOneByEmail(email: string) {
    try {
      const userAlreadyExists = await this.repository.findOneBy({ email });
      if (!userAlreadyExists) return null;

      return userAlreadyExists
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.repository.findOneBy({ id });

      if (!result) throw new Error('Usuário não foi encontrado.');

      await this.repository.update(id, updateUserDto);

      return {
        success: true,
        result: await this.repository.findOneBy({ id }),
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: string) {
    try {
      const result = await this.repository.findOneBy({ id });

      if (!result) throw new Error('Usuário não foi encontrado.');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Usuário removido com sucesso.',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async verifySuperAdmin() {
    try {
      const superAdmin = await this.repository.findOneBy({ type: TypeUserEnum.SUPER_ADMIN });
      if (!superAdmin) {
        const user = new User();
        user.name = 'Super Admin';
        user.email = 'admin@adcatalao.com.br';
        user.password = 'adcatalao';
        user.phone = '(64) 99626-8117';
        user.type = TypeUserEnum.SUPER_ADMIN;
        await this.repository.save(user);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
