import * as SocketIO from 'socket.io';
import { Message } from './model/Message';
import { ChatRoom } from './entities/ChatRoom';

export class Sockets
{
    private _sio: SocketIO.Server;

    constructor(socketIoServer: SocketIO.Server)
    {
        this._sio = socketIoServer;
    }

    public listen(chatRooms: ChatRoom[]): void {

        chatRooms.forEach(room => {
            const listenRoom = this._sio.of(room.id);
            console.log(`[socket][chatRoom](${room.label}): started listening`);

            listenRoom.on('connect', (socket => {
                console.log(`[socket][chatRoom](${room.label}): connected client`);

                socket.on('message', (m: Message) => {
                    console.log(`[server][chatRoom][${room.label}](message): ${JSON.stringify(m)}`);
                    listenRoom.emit('message', m);
                });

                socket.on('disconnect', () => {
                    console.log(`[server][chatRoom](${room.label}): Client disconnected`);
                });
            }));
        });
    }
}
