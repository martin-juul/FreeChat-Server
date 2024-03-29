import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Request, Response } from 'express';
import { createClient } from 'redis';
import * as sio from 'socket.io';
import * as redisAdapter from 'socket.io-redis';
import { createConnection, getRepository } from 'typeorm';
import { ChatRoom } from './entities/ChatRoom';
import { AppRoutes } from './routes';
import { Sockets } from './sockets';

// create connection pool with postgres
createConnection().then(async connection => {
    const app = express();

    // Express server config
    app.set('port', process.env.PORT || 8080);

    // CORS
    app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-FREECHAT-TOKEN, Access-Control-Allow-Origin');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

    // support application/json
    app.use(bodyParser.json());
    // support application/x-www-form-urlencoded
    //app.use(bodyParser.urlencoded({ extended: false }));
    // serve files in public directory
    app.use(express.static('public'));

    // register routes
    AppRoutes.forEach(route => {
        app[ route.method ](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    // Start server
    const server = app.listen(app.get('port'), () => {
        console.log('[server]: listening on port ' + app.get('port'));
    });

    // Socket.IO
    const io = sio(server, {
        pingInterval: 1000
    });

    // Socket.IO Redis
    io.adapter(redisAdapter({
        host: 'localhost',
        port: 6379
    }));

    // Redis Client
    const redis = createClient({
        host: 'localhost',
        port: 6379
    });

    // Initialize rooms
    const chatSockets = new Sockets(io, redis);
    const chatRoomRepository = await getRepository(ChatRoom);

    chatSockets.listen(await chatRoomRepository.find());
}).catch(error =>
    console.error('TypeORM connection error: ', error)
);
