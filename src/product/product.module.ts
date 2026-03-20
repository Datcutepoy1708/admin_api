import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Products } from './entities/product.entity';
import { Technology } from '../technologys/entities/technology.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Technology, Category])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
