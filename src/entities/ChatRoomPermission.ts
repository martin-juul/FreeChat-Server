import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ChannelPermission } from '../model/Permission';
import { ChatRoom } from './ChatRoom';
import { Member } from './Member';

@Entity()
export class ChatRoomPermission
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Member, member => member.chatRoomPermissions)
    member: Member;

    @Column({
        type: 'enum',
        enum: ChannelPermission
    })
    role: ChannelPermission;

    @ManyToOne(type => ChatRoom, chatRoom => chatRoom.id)
    chatRoomId: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
