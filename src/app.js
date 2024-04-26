import express, { urlencoded } from 'express';
import config from './config.js';
import cartsRoutes from './routes/carts.routes.js';
import productsRoutes from './routes/products.routes.js';

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

//*products

app.use('/api/products', productsRoutes);
app.use('/api/product', productsRoutes);

app.use('/api/products/add', productsRoutes);

app.use('/api/product/update', productsRoutes);

app.use('/api/product/delete', productsRoutes);

//*carts
app.use('/api/cart', cartsRoutes);
app.use('/api/cart/add', cartsRoutes);
app.use('/api/cart/new', cartsRoutes);

app.listen(config.PORT, () => {
	console.log(`App activa en puerto ${config.PORT}`);
});
