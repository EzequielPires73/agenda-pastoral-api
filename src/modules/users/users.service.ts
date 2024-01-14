import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const result = await this.repository.findOneBy({email: createUserDto.email});
      if(result) throw new Error(`Usuário com o email ${createUserDto.email} já existe.`);

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

  async findAll() {
    try {
      const [results, total] = await this.repository.findAndCount();

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
      const result = await this.repository.findOneBy({id});

      if(!result) throw new Error('Usuário não foi encontrado.');

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

  async findOneByEmail(email: string) {
    try {
      const userAlreadyExists = await this.repository.findOneBy({email});
      if(!userAlreadyExists) return null;

      return userAlreadyExists
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.repository.findOneBy({id});

      if(!result) throw new Error('Usuário não foi encontrado.');

      await this.repository.update(id, updateUserDto);

      return {
        success: true,
        result: await this.repository.findOneBy({id}),
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
      const result = await this.repository.findOneBy({id});

      if(!result) throw new Error('Usuário não foi encontrado.');

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
}
