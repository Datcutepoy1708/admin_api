import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TechnologysService } from './technologys.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('technologys')
export class TechnologysController {
  constructor(private readonly technologysService: TechnologysService) {}

  @Post()
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologysService.create(createTechnologyDto);
  }

  @Get()
  findAll() {
    return this.technologysService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ) {
    return this.technologysService.update(+id, updateTechnologyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologysService.remove(+id);
  }
}
