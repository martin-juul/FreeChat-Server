import { Request, Response } from 'express';
import { ISocketConnection } from '../model/ISocketConnection';

export let connect = (request: Request, response: Response, socket: any) => {
    const rooms = [
        {
            id: '9658e2de-2472-44dd-9372-13b9fe611faa',
            label: 'General'
        },
        {
            id: 'aca9ed9a-d39d-4e43-960f-06ca4179838b',
            label: 'Code'
        },
        {
            id: '66e8d684-5842-45a8-b36a-3fa7683a23c2',
            label: 'Games'
        }
    ];
    const requestedRoom: ISocketConnection = request.body;

    if (rooms['id'][requestedRoom.roomId]) {



    } else {
        return response.status(404);
    }
};
