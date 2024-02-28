import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private repository: Repository<Member>
  ) { }

  async create(createMemberDto: CreateMemberDto) {
    try {
      const result = await this.repository.findOneBy({ email: createMemberDto.email });
      if (result) throw new Error(`Membro com o email ${createMemberDto.email} já existe.`);

      const user = this.repository.create(createMemberDto);

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
      const result = await this.repository.findOneBy({ id });

      if (!result) throw new Error('Membro não foi encontrado.');

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
      if (!result) throw new Error('Membro não foi encontrado.');

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

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    try {
      const {password, ...data} = updateMemberDto;
      const result = await this.repository.findOneBy({ id });

      if (!result) throw new Error('Membro não foi encontrado.');

      await this.repository.update(id, data);

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

      if (!result) throw new Error('Membro não foi encontrado.');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Membro removido com sucesso.',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async generateMonthlyReportLast6Months() {
    try {
      const currentDate = new Date();
      const sixMonthsAgoDate = new Date();
      sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);
      const monthlyCounts = [];

      for (let i = 0; i <= 6; i++) {
        const startDate = new Date(sixMonthsAgoDate.getFullYear(), sixMonthsAgoDate.getMonth(), 1);
        const endDate = new Date(sixMonthsAgoDate.getFullYear(), sixMonthsAgoDate.getMonth() + 1, 0);

        const count = await this.repository.count({
          where: {
            createdAt: Between(startDate, endDate),
          },
        });

        monthlyCounts.push({
          name: startDate.toLocaleString('default', { month: 'long' }),
          count: count,
        });

        sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() + 1);
      }

      return {
        success: true,
        results: monthlyCounts,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
