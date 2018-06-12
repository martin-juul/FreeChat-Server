import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GlobalPermission } from '../model/Permission';

@Entity()
export class Member
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({
        type: 'varchar',
        length: 6
    })
    color?: string;

    @Column({
        type: 'enum',
        enum: GlobalPermission,
        default: 'MEMBER'
    })
    role: GlobalPermission;

    @Column({
        nullable: true
    })
    isBanned: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
