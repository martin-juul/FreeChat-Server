import { RedisClient } from 'redis';
import * as SocketIO from 'socket.io';
import { ChatRoom } from './entities/ChatRoom';
import { Message } from './model/Message';
import { OpenGraphService } from './services/OpenGraphService';

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
            const connectedUsers = [];
            console.log(`[socket][chatRoom](${room.label}): started listening`);

            listenRoom.on('connect', socket => {

                // Get chat history from redis, and send to the connected client.
                this._redisClient.lrange(`${room.id}:messages`, 0, 100, (err, reply) => {

                    if (reply) {
                        reply.forEach((message) => {
                            socket.emit('message', (<Message>JSON.parse(message)));
                        })
                    } else {
                        console.error(err)
                    }
                });

                socket.on('client-connected', (user) => {
                    connectedUsers.push(user);
                    listenRoom.emit('connected-clients', connectedUsers);
                    console.log(connectedUsers);
                });

                // When a client connected, emit connected clients to all participants
                socket.on('get-connected-clients', () => {
                    //console.log(`[server][chatRoom][${room.label}](connected clients):${JSON.stringify(listenRoom.clients(clients => clients))}`);

                });

                socket.on('message', (m: Message) => {

                    console.log(`[server][chatRoom][${room.label}](message): ${JSON.stringify(m)}`);

                    // push to channels chat history
                    if (m.content) {
                        m.content = this.sanitize(m.content);
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
            return text.replace(/</g, '&lt').replace(/>/g, '&gt').trim();
        }
        return text;
    }
}

/*
    const res = OpenGraphService.scrapeSite('https://facebook.com', function (error, results) {
        console.log('error:', error); // This is returns true or false. True if there was a error. The error it self is inside the results object.
        console.log('results:', results.data);
    });
 */
