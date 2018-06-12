import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member';

@Entity()
export class AuthToken
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Member, member => member.authTokens)
    member: Member;

    @Column({ type: 'inet' })
    ip: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
