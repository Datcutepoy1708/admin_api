import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from './entities/technology.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechnologysService {
  constructor(
    @InjectRepository(Technology)
    private technologyRepository: Repository<Technology>
  ) { }
  async create(createTechnologyDto: CreateTechnologyDto) {
    const tech = this.technologyRepository.create(createTechnologyDto);
    const saved = await this.technologyRepository.save(tech)
    return {
      success: true,
      data: {
        saved
      }
    }
  }

  async findAll() {
    return await this.technologyRepository.find();
  }


  async update(id: number, updateTechnologyDto: UpdateTechnologyDto) {
    const technology = await this.technologyRepository.findOne({ where: { id } })
    if (!technology) {
      throw new NotFoundException("Not found exception");
    }
    Object.assign(technology, updateTechnologyDto);
    const updated = await this.technologyRepository.save(technology);
    return {
      success: true,
      data: updated
    }
  }

  async remove(id: number) {
    const technology = await this.technologyRepository.findOne({ where: { id } })
    if (!technology) {
      throw new NotFoundException("Not found exception");
    }
    await this.technologyRepository.remove(technology);
    return {
      success: true,
      message: `Remove successfully faq with id=${id}`
    }
  }
}
