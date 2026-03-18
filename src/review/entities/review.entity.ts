import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'full_name' })
    fullName: string

    @Column({ name: 'job' })
    job: string

    @Column({ name: 'rate' })
    rate: number

    @Column({ name: 'comment', type: 'text' })
    comment: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date
}
