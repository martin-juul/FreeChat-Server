import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ChatRoom } from '../entities/ChatRoom';

export namespace ChatController
{
    export async function getChatRooms(request: Request, response: Response) {
        const chatRoomRepository = await getRepository(ChatRoom);

        try {
            const rooms: ChatRoom[] = await chatRoomRepository.find();

            response.json(rooms);
        } catch (err) {
            response.json(err).status(500);
        }
    }

    export async function postCreateChatRoom(request: Request, response: Response) {
        try {
            const chatRoomRepository = await getRepository(ChatRoom);
            const chatRoom = new ChatRoom();
            chatRoom.label = await request.body.label;

            chatRoomRepository.save(chatRoom).then(chatRoom => {
                response.json(chatRoom).status(201);
            });

        } catch (err) {
            console.error('[ChatController](postCreateChatRoom)', err);
            response.status(500);
        }
    }
}
