import { Router } from 'express';
import config from '../config.js';
import productManager from '../productManager.js';
import { uploader } from '../uploader.js';

const router = Router();

const manager = new productManager(`${config.DIRNAME}/products.json`);

//handlebars

router.get('/', (req, res) => {
	manager.getProducts().then((data) => {
		const name = 'Oscar';
		console.log(data);
		res.render('index', { products: data, name: name });
	});
});

// websocket socket.io
router.get('/realtimeproducts', (req, res) => {
	manager.getProducts().then((data) => {
		// console.log(data);
		res.render('realTimeProducts', { products: data });
	});
});

router.post('realtimeproducts', uploader.single('thumbnail'),(req, res) => {
	console.log(req.body);
	console.log(req.file);
	const data = req.body
	res.render('realtimeproducts', { origin: 'post', products: data });
});

export default router;
