import { Request, Response } from 'express';
import { ChatRoomRepository } from '../repositories/ChatRoomRepository';
import { ChatRoom } from '../model/ChatRoom';

export async function getChatRooms(request: Request, response: Response) {
    const chatRoomRepository = new ChatRoomRepository();

    try {
        const rooms: ChatRoom[] = chatRoomRepository.getRooms();

        response.json(rooms);
    } catch (err) {
        response.json(err).status(500);
    }
}
