import { getChatRooms } from './controllers/ChatController';
import { Request, Response } from 'express';

export interface Route
{
    path: string;
    method: string;
    action: (request: Request, response: Response) => Promise<void>
}

export const AppRoutes: Route[] = [
    { path: '/chat/rooms', method: 'get', action: getChatRooms }
];
