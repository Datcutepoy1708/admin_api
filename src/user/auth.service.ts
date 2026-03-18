import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';

import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async register(registerDTO: RegisterDto) {
    const { fullName, email, password, phone } = registerDTO;

    // check email already exist 
    const existingUser = await this.userRepository.findOne({
      where: { email }
    })

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);


    console.log(passwordHash);

    const user = this.userRepository.create({
      fullName,
      email,
      passwordHash,
      phone
    })

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = {
      sub: savedUser.id,
      email: savedUser.email
    }

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        token,
        user: {
          id: savedUser.id,
          fullName: savedUser.fullName,
          email: savedUser.email,
          phone: savedUser.phone
        }
      }
    }
  }


  async login(loginDTO: LoginDto) {
    const { email, password } = loginDTO;

    const user = await this.userRepository.findOne({
      where: { email }
    })

    if (!user) {
      console.log('User not found by email:', email);
      throw new UnauthorizedException('Invalid credentitals');
    }


    const isPasswordValid = await bcrypt.compare(password,user.passwordHash);


    if (!isPasswordValid) {
      console.log('bcrypt compare failed for password:', password);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email
    }

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        }
      }
    }
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    };
  }
}
