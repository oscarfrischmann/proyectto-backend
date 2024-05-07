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

app.use('/api/products', productsRoutes);
app.use('/', viewsRoutes);
// app.use('/api/product', productsRoutes);

// app.use('/api/products/add', productsRoutes);

// app.use('/api/product/update', productsRoutes);

// app.use('/api/product/delete', productsRoutes);
app.use('/static', express.static(`${config.DIRNAME}/public`));
app.use('/realtimeproducts', viewsRoutes);

//*carts

app.use('/api/cart', cartsRoutes);
app.use('/api/cart/add', cartsRoutes);
app.use('/api/cart/new', cartsRoutes);

const httpServer = app.listen(config.PORT, () => {
	console.log(`App activa en puerto ${config.PORT}`);
});

const socketServer = new Server(httpServer);
//escucho evento tipo conxión
socketServer.on('connection', (socket) => {
	console.log(`Cliente conectado, id ${socket.id} desde ${socket.handshake.address}`);
	socket.on('newProduct', (data) => {
		console.log('socket on app');
		socket.emit('newProduct', data);
	});
});
