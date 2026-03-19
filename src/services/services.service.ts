import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { Technology } from 'src/technologys/entities/technology.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,

    @InjectRepository(Technology)
    private technologyRepository: Repository<Technology>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const { technologyIds, ...rest } = createServiceDto;

    // Tìm các technology theo id
    const technologies = technologyIds?.length
      ? await this.technologyRepository.findByIds(technologyIds)
      : [];

    const service = this.serviceRepository.create({
      ...rest,
      technologies,
    });

    const saved = await this.serviceRepository.save(service);
    return { success: true, data: saved };
  }

  async findAll() {
    const data = await this.serviceRepository.find({
      relations: ['technologies'], // ← load kèm technologies
    });
    return { success: true, data };
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });

    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }

    return { success: true, data: service };
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });

    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }

    const { technologyIds, ...rest } = updateServiceDto;

    // Cập nhật technologies nếu có truyền vào
    if (technologyIds) {
      service.technologies =
        await this.technologyRepository.findByIds(technologyIds);
    }

    Object.assign(service, rest);
    const updated = await this.serviceRepository.save(service);
    return { success: true, data: updated };
  }

  async remove(id: number) {
    const service = await this.serviceRepository.findOne({ where: { id } });

    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }

    await this.serviceRepository.remove(service);
    return { success: true, message: `Service #${id} deleted successfully` };
  }
}
