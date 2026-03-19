import { Technology } from 'src/technologys/entities/technology.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tittle', type: 'text' })
  tittle: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'status', default: true })
  status: boolean;

  @ManyToMany(() => Technology)
  @JoinTable({ name: 'service_technology' })
  technologies: Technology[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
