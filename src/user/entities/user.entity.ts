import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enum/user.enum";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT,
    })
    role!: Role;

    @Column({
        type: 'varchar',
        nullable: true
    })
    refreshToken!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

}
