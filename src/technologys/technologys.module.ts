import { Module } from '@nestjs/common';
import { TechnologysService } from './technologys.service';
import { TechnologysController } from './technologys.controller';
import { Technology } from './entities/technology.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TechnologysController],
  providers: [TechnologysService],
  imports: [TypeOrmModule.forFeature([Technology])],
})
export class TechnologysModule { }
