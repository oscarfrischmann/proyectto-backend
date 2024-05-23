import express, { urlencoded } from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import config from './config.js';
import cartsRoutes from './routes/carts.routes.js';
import productsRoutes from './routes/products.routes.js';
import viewsRoutes from './routes/views.routes.js';

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/static', express.static(`${config.DIRNAME}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

//*products

app.use('/', productsRoutes);
app.use('/', viewsRoutes);

app.use('/static', express.static(`${config.DIRNAME}/public`));

//*carts

app.use('/api/cart', cartsRoutes);
app.use('/api/cart/add', cartsRoutes);
app.use('/api/cart/new', cartsRoutes);

const httpServer = app.listen(config.PORT, () => {
	console.log(`App activa en puerto ${config.PORT}`);
});

const socketServer = new Server(httpServer);
app.set('socketServer', socketServer);
//escucho evento tipo conxión
socketServer.on('connection', (client) => {
	console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
	client.on('newProduct', (data) => {
		socketServer.emit('newProductConfirmation', 'OK', data);
	});
});
