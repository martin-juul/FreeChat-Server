import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GlobalPermission } from '../model/Permission';
import { AuthToken } from './AuthToken';
import { ChatRoomPermission } from './ChatRoomPermission';

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

    @OneToMany(type => ChatRoomPermission, chatRootPermission => chatRootPermission.member)
    chatRoomPermissions?: ChatRoomPermission[];

    @OneToMany(type => AuthToken, authToken => authToken.member)
    authTokens: AuthToken[];

    @Column({
        nullable: true
    })
    isBanned: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
