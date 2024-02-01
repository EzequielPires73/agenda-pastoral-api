import { Injectable } from '@nestjs/common';
import { CreateAvailableTimeDto } from './dto/create-available-time.dto';
import { UpdateAvailableTimeDto } from './dto/update-available-time.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailableTime } from './entities/available-time.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { isValidDateFormat, isValidTimeFormat, isValidTimeRange } from 'src/helpers/date';
import { FindAvaibleTimesDto } from './dto/find-avaible-times.dto copy';

@Injectable()
export class AvailableTimesService {
  constructor(
    @InjectRepository(AvailableTime) private repository: Repository<AvailableTime>
  ) { }

  async create(createAvailableTimeDto: CreateAvailableTimeDto) {
    try {
      if (!isValidDateFormat(createAvailableTimeDto.date.toString())) throw new Error('Formato da data deve ser yyyy-MM-dd');
      if (!isValidTimeFormat(createAvailableTimeDto.end) || !isValidTimeFormat(createAvailableTimeDto.end)) throw new Error('Formato da horário deve ser 00:00:00');
      if (!isValidTimeRange(createAvailableTimeDto.start, createAvailableTimeDto.end)) throw new Error('O intervalo de tempo não é válido.');

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

  async findAll(queryDto: FindAvaibleTimesDto) {
    try {
      const { month, year, date } = queryDto;
      const query = this.repository.createQueryBuilder('avaible-times');

      if (month && year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        query.andWhere('avaible-times.date >= :start', { start: start });
        query.andWhere('avaible-times.date <= :end', { end: end });
      }

      {date ? query.andWhere('avaible-times.date = :date', {date}) : null}

      const [results, total] = await query.getManyAndCount();

      return {
        success: true,
        results: this.groupBy(results),
        total
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  groupBy(list: any[]) {
    return list.reduce((acc, item) => {
      const groupKey = item.date;
      const existingGroup = acc.find(group => group.date === groupKey);

      if (existingGroup) {
        existingGroup.times.push({
          id: item.id,
          start: item.start,
          end: item.end
        });
      } else {
        acc.push({
          date: groupKey,
          times: [{
            id: item.id,
            start: item.start,
            end: item.end
          }]
        });
      }

      return acc;
    }, []);
  }

  async findOne(id: number) {
    try {
      const availableTime = await this.repository.findOneBy({ id });
      if (availableTime) throw new Error('Tempo disponível não encontrado.');

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
      const availableTime = await this.repository.findOneBy({ id });
      if (availableTime) throw new Error('Tempo disponível não encontrado.');

      await this.repository.update(id, updateAvailableTimeDto);

      return {
        success: true,
        message: 'Tempo disponível atualizado com sucesso.',
        result: await this.repository.findOneBy({ id })
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
      const availableTime = await this.repository.findOneBy({ id });
      if (availableTime) throw new Error('Tempo disponível não encontrado.');

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
