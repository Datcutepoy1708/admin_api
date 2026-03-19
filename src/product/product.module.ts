import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from 'src/technologys/entities/technology.entity';
import { Products } from './entities/product.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
   imports: [TypeOrmModule.forFeature([Technology,Products])],
})
export class ProductModule {}
