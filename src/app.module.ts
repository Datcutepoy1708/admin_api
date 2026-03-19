import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Controllers & Services
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';

import { UserModule } from './user/auth.module';
import { FaqModule } from './faq/faq.module';
import { FaqController } from './faq/faq.controller';
import { FaqService } from './faq/faq.service';
import { Faq } from './faq/entities/faq.entity';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/entities/contact.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';

import { EmployeesModule } from './employees/employees.module';
import { UploadModule } from './upload/upload.module';
import { Employee } from './employees/entities/employee.entity';


@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,Faq,Contact,Review,Employee
        ],
        synchronize: true, // Auto generate schema from entities
      }),
    }),

    // Global JWT
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
    UserModule,
    FaqModule,
    ContactModule,
    ReviewModule,
    EmployeesModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
