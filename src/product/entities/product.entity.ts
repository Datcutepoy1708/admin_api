import { Technology } from "src/technologys/entities/technology.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'thumbnail', type: 'text' })
  thumbnail: string;          // ảnh

  @Column({ name: 'category' })
  category: string;           
  @Column({ name: 'title', type: 'text' })
  title: string;              

  @Column({ name: 'description', type: 'text' })
  description: string;        // mô tả ngắn

  @Column({ name: 'status', default: true })
  status: boolean;

  @ManyToMany(() => Technology)
  @JoinTable({ name: 'product_technology' })
  technologies: Technology[]; // Next.js, TypeScript, Stripe, AWS

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}