import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Message } from './model/message.model';

export class ChatServer
{
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.listenRooms();
    }

    public getApp(): express.Application {
        return this.app;
    }

    // Creates an instance of the Express App
    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
        this.app.all('/*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-FREECHAT-TOKEN, Access-Control-Allow-Origin');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port)
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);

            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    private listenRooms(): void {
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

        rooms.forEach(room => {
            const listenRoom = this.io.of(room.id);

            listenRoom.on('connect', (socket: any) => {
                console.log(`[server][${room.label}]: connected client on port ${this.port}`);

                socket.on('message', (m: Message) => {
                   console.log(`[server][${room.label}](message): ${JSON.stringify(m)}`);
                   listenRoom.emit('message', m);
                });
            })
        });
    }
}
