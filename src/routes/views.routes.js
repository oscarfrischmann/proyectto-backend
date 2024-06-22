import { Router } from 'express';
import config from '../config.js';
import productManager from '../productManager.js';
import { uploader } from '../uploader.js';
import productsModel from '../dao/models/products.model.js';
const router = Router();

const manager = new productManager(`${config.DIRNAME}/products.json`);

//handlebars

router.get('/', async (req, res) => {
	let data;
	try {
		data = await productsModel.find().lean();
		res.render('index', { products: data });
	} catch (err) {
		res.status(404).send({ origin: 'render index', error: err });
	}
});

// websocket socket.io
router.get('/realtimeproducts', async (req, res) => {
	const data = await productsModel.find().lean();
	res.render('realTimeProducts', { products: data });
});

router.post('realtimeproducts', uploader.single('thumbnail'), (req, res) => {
	console.log(req.body);
	console.log(req.file);
	const data = req.body;
	res.render('realtimeproducts', { origin: 'post', products: data });
});

export default router;
