import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>
  ) { }
  async create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create(createReviewDto);
    const saved = await this.reviewRepository.save(review);
    return {
      success: true,
      data: { saved }
    }
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const query = this.reviewRepository.createQueryBuilder('contact');
    if (search) {
      query.where(
        'review.full_name ILIKE: search OR review.job ILIKE:search',
        { search: `%${search}%` }
      )
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).orderBy('contact.createdAt', 'DESC').getMany();

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
    const contact = await this.reviewRepository.findOne({ where: { id } })
    if (!contact) {
      throw new NotFoundException("Not found contact");
    }
    return {
      success: true,
      data: contact
    }
  }


  async remove(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } })
    if (!review) {
      throw new NotFoundException("not found review");
    }
    await this.reviewRepository.remove(review);
    return {
      success: true,
      message: `Remove successfully review with id=${id}`
    }
  }
}
