import express, { urlencoded } from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import config from './config.js';
import cartsRouter from './routes/carts.routes.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import usersRouter from './routes/users.routes.js';

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/static', express.static(`${config.DIRNAME}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

//* views
app.use('/', viewsRouter);

//*products

app.use('/', productsRouter);
app.use('/', usersRouter);

app.use('/static', express.static(`${config.DIRNAME}/public`));

//*carts

app.use('/', cartsRouter);

const httpServer = app.listen(config.PORT, async () => {
	await mongoose.connect(config.ATLAS_URI);
	console.log(`App activa en puerto ${config.PORT} enlazada a DB remota`);
});

const socketServer = new Server(httpServer);
app.set('socketServer', socketServer);
//escucho evento tipo conxión
socketServer.on('connection', (client) => {
	console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
	client.on('newProduct', () => {
		console.log('newProduct function on');
		socketServer.emit('newProductConfirmation', 'OkOKOK');
	});
});
