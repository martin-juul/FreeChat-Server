import { RedisClient } from 'redis';
import * as SocketIO from 'socket.io';
import { ChatRoom } from './entities/ChatRoom';
import { Message } from './model/Message';

export class Sockets
{
    private _sio: SocketIO.Server;
    private _redisClient: RedisClient;

    constructor(socketIoServer: SocketIO.Server, redisClient: RedisClient) {
        this._sio = socketIoServer;
        this._redisClient = redisClient;
    }

    public listen(chatRooms: ChatRoom[]): void {

        chatRooms.forEach(room => {
            const listenRoom = this._sio.of(room.id);
            console.log(`[socket][chatRoom](${room.label}): started listening`);

            listenRoom.on('connect', socket => {
                this._redisClient.lrange(`${room.id}:messages`, 0, 100, (err, reply) => {
                    if (reply) {
                        reply.forEach((message) => {
                            listenRoom.emit('message', (<Message>JSON.parse(message)));
                        })
                    }

                    console.error(err);
                });

                //listenRoom.emit('message', history);

                console.log(`[socket][chatRoom](${room.label}): connected client: ${socket.client.conn.id}`);

                socket.on('get-connected-clients', () => {
                    console.log(`[server][chatRoom][${room.label}](message): ${JSON.stringify('')}`);
                });

                // socket.on('get-history', () => {
                //     const history = this._redisClient.hgetall(`${room.id}:messages`);
                //
                //     listenRoom.emit('get-history', history);
                // });

                socket.on('message', (m: Message) => {
                    console.log(`[server][chatRoom][${room.label}](message): ${JSON.stringify(m)}`);

                    // push to rooms chat history
                    if (m.content) {
                        this._redisClient.rpush(`${room.id}:messages`, JSON.stringify(m));
                    }

                    // latest message
                    //this._redisClient.publish(`${room.id}:messages:latest`, JSON.stringify(m));

                    listenRoom.emit('message', m);
                });

                socket.on('disconnect', () => {
                    console.log(`[server][chatRoom](${room.label}): Client disconnected`);
                });
            });
        });
    }

    protected sanitize(text: string) {
        if (text.indexOf('<') > -1 || text.indexOf('>') > -1) {
            return text.replace(/</g, '&lt').replace(/>/g, '&gt');
        }
        return text;
    }

    protected emitEvent(event: string, listener?: (...args: any[]) => void) {
        if (!listener) {

        }
    }
}
