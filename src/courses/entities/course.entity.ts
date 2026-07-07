import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Level } from '../enum/course.enum';
import { User } from 'src/user/entities/user.entity';


@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        type: 'text',
    })
    description!: string;

    @Column({
        type: 'enum',
        enum: Level,
    })
    level!: Level;

    @Column()
    price!: number;

    //courses many but can have one creator only
    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdBy' }) //Store the foreign key in a column named createdBy
    createdBy!: User;

    @CreateDateColumn()
    createdAt!: Date;

    // automatically updated by softDelete
    @DeleteDateColumn()
    deletedAt!: Date;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'deletedBy' })
    deletedBy?: User;

    @Column({
        default: false,
    })
    deletedByAdmin!: boolean;
}