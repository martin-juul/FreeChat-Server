import { Request, Response } from 'express';
import { AuthController } from './controllers/AuthController';
import { ChatController } from './controllers/ChatController';

export interface Route
{
    path: string;
    method: string;
    action: (request: Request, response: Response) => Promise<void>
}

export const AppRoutes: Route[] = [
    { path: '/auth', method: 'post', action: AuthController.postCreateToken },
    { path: '/auth/validate', method: 'post', action: AuthController.postCreateToken },
    { path: '/chat/rooms', method: 'get', action: ChatController.getChatRooms },
];
