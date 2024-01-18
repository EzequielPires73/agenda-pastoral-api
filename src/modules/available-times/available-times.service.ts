import { Injectable } from '@nestjs/common';
import { CreateAvailableTimeDto } from './dto/create-available-time.dto';
import { UpdateAvailableTimeDto } from './dto/update-available-time.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailableTime } from './entities/available-time.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class AvailableTimesService {
  constructor(
    @InjectRepository(AvailableTime) private repository: Repository<AvailableTime>
  ) { }

  async create(createAvailableTimeDto: CreateAvailableTimeDto) {
    try {
      const availableTime = this.repository.create(createAvailableTimeDto);

      const exists = await this.verify(createAvailableTimeDto);
      
      if (exists.length > 0) {
        const date = new Date(createAvailableTimeDto.date);
        date.setHours(date.getHours() + 3);
        throw new Error(`Horário está chocando com outro na data de ${date.toLocaleDateString()}`);
      }

      return {
        success: true,
        message: 'Tempo disponível cadastrado com sucesso.',
        availableTime: await this.repository.save(availableTime),
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async verify({ date, start, end }: CreateAvailableTimeDto): Promise<AvailableTime[]> {
    return this.repository.find({
      where: {
        date: date,
        start: LessThan(end),
        end: MoreThan(start),
      },
    });
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    try {
      const availableTime = await this.repository.findOneBy({id});
      if(availableTime) throw new Error('Tempo disponível não encontrado.');

      return {
        success: true,
        result: availableTime
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: number, updateAvailableTimeDto: UpdateAvailableTimeDto) {
    try {
      const availableTime = await this.repository.findOneBy({id});
      if(availableTime) throw new Error('Tempo disponível não encontrado.');

      await this.repository.update(id, updateAvailableTimeDto);

      return {
        success: true,
        message: 'Tempo disponível atualizado com sucesso.',
        result: await this.repository.findOneBy({id})
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: number) {
    try {
      const availableTime = await this.repository.findOneBy({id});
      if(availableTime) throw new Error('Tempo disponível não encontrado.');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Tempo disponível removido com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
