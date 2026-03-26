import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Technology } from '../../technologys/entities/technology.entity';
import { Category } from '../../category/entities/category.entity';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'thumbnail', type: 'text' })
  thumbnail: string;

  @Column({ name: 'title', type: 'text' })
  title: string;

  @Column({ name: 'slug', type: 'text' })
  slug: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'status', default: true })
  status: boolean;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Technology)
  @JoinTable({ name: 'product_technology' })
  technologies: Technology[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
