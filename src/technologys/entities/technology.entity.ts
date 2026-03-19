import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('technology')
export class Technology {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'tech_name' })
    name: string

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
