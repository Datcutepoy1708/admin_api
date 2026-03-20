import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/product.entity';
import { Technology } from '../technologys/entities/technology.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private productRepository: Repository<Products>,

    @InjectRepository(Technology)
    private technologyRepository: Repository<Technology>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { technologyIds, categoryId, ...rest } = createProductDto;

    const technologies = technologyIds?.length
      ? await this.technologyRepository.findByIds(technologyIds)
      : [];

    let category: Category | undefined = undefined;
    if (categoryId) {
      const found = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!found)
        throw new NotFoundException(`Category #${categoryId} not found`);
      category = found;
    }

    const product = this.productRepository.create({
      ...rest,
      ...(category ? { category } : {}),
      technologies,
    });

    const saved = await this.productRepository.save(product);
    return { success: true, data: saved };
  }

  async findAll() {
    const data = await this.productRepository.find({
      relations: ['technologies', 'category'],
    });
    return { success: true, data };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['technologies', 'category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return { success: true, data: product };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['technologies', 'category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);

    const { technologyIds, categoryId, ...rest } = updateProductDto;

    if (technologyIds) {
      product.technologies =
        await this.technologyRepository.findByIds(technologyIds);
    }

    if (categoryId !== undefined) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category)
        throw new NotFoundException(`Category #${categoryId} not found`);
      product.category = category;
    }

    Object.assign(product, rest);
    const updated = await this.productRepository.save(product);
    return { success: true, data: updated };
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    await this.productRepository.remove(product);
    return { success: true, message: `Product #${id} deleted successfully` };
  }
}
