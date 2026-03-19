import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}
  async create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);
    const saved = await this.contactRepository.save(contact);
    return {
      success: true,
      data: {
        saved,
      },
    };
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const query = this.contactRepository.createQueryBuilder('contact');
    if (search) {
      query.where(
        'contact.full_name ILIKE: search OR contact.email ILIKE:search',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const data = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('contact.createdAt', 'DESC')
      .getMany();

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException('Not found contact');
    }
    return {
      success: true,
      data: contact,
    };
  }
}
