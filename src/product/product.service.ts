import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from 'src/technologys/entities/technology.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Products)
    private productRepository: Repository<Products>,

    @InjectRepository(Technology)
    private technologyRepository: Repository<Technology>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const { technologyIds, ...rest } = createProductDto;

    // Tìm các technology theo id
    const technologies = technologyIds?.length
      ? await this.technologyRepository.findByIds(technologyIds)
      : [];

    const products = this.productRepository.create({
      ...rest,
      technologies,
    });

    const saved = await this.productRepository.save(products);
    return { success: true, data: saved };
  }


  async findAll() {
    const data = await this.productRepository.find({
      relations: ['technologies'],
    });
    return { success: true, data };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return { success: true, data: product };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });

    if (!product) {
      throw new NotFoundException(`Portfolio #${id} not found`);
    }

    const { technologyIds, ...rest } = updateProductDto;

    if (technologyIds) {
      product.technologies = await this.technologyRepository.findByIds(technologyIds);
    }

    Object.assign(product, rest);
    const updated = await this.productRepository.save(product);
    return { success: true, data: updated };
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    await this.productRepository.remove(product);
    return { success: true, message: `Product #${id} deleted successfully` };
  }

}
