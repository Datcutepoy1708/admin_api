import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(newEmployee);
  }

  async findAll() {
    return await this.employeeRepository.find({
      order: { id: 'DESC' }, // Sắp xếp nhân viên mới nhất lên đầu
    });
  }

  async findOne(id: number) {
    return await this.employeeRepository.findOneBy({ id });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const employee = await this.findOne(id);
    if (employee) {
      await this.employeeRepository.delete(id);
      return { message: `Đã xóa nhân viên #${id} thành công` };
    }
    return { message: `Không tìm thấy nhân viên #${id}` };
  }
}
