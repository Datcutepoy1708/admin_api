import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>
  ) { }

  async create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRepository.create(createFaqDto);
    const saved = await this.faqRepository.save(faq);
    return {
      success: true,
      data: {
        saved
      }
    }
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const query = this.faqRepository.createQueryBuilder('faq');
    if (search) {
      query.where(
        'faq.question ILIKE: search OR faq.answer ILKE:search',
        { search: `%${search}%` }
      )
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).orderBy('faq.createdAt', 'DESC')
      .getMany();

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
      }
    }
  }

  async findOne(id: number) {
    const faq = await this.faqRepository.findOne({ where: { id } })

    if (!faq) {
      throw new NotFoundException("Not found");
    }

    return {
      success: true,
      data: faq
    }
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqRepository.findOne({ where: { id } })
    if (!faq) {
      throw new NotFoundException("Not found exception");
    }
    Object.assign(faq, updateFaqDto);

    const updated = await this.faqRepository.save(faq);

    return {
      success: true,
      data: updated
    }
  }

  async remove(id: number) {
    const faq = await this.faqRepository.findOne({ where: { id } })
    if (!faq) {
      throw new NotFoundException("Not found exception")
    }
    await this.faqRepository.remove(faq);

    return {
      success: true,
      message: `Reove successfully faq with id=${id}`
    }
  }


}
