import { Router } from 'express';
import config from '../config.js';
import productManager from '../productManager.js';
import cartManager from '../cartManager.js';
import cartsModel from '../dao/models/carts.model.js';

const router = Router();

const pManager = new productManager(`${config.DIRNAME}products.json`);
const cManager = new cartManager(`${config.DIRNAME}carts.json`);

router.get('/db/carts', async (req, res) => {
	try {
		const carts = await cartsModel.find().lean();
		console.log('consulto a DB por carritos');
		res.status(200).send({ origin: 'getCart from DB', payload: carts });
	} catch (err) {
		res.status(500).send({ origin: 'getCart from DB', payload: err });
	}
});

router.get('/:cid', (req, res) => {
	const { cid } = req.params;
	cManager.getCartByCid(parseInt(cid)).then((data) => {
		res.status(200).send({ origin: 'getCart ByCid', payload: data });
	});
});

router.post('/', (req, res) => {
	cManager.createCart().then((data) => {
		res.status(200).send({ origin: 'post createCart', payload: data });
	});
});

router.post('/:pid/:cid/:quantity', (req, res) => {
	let { pid, cid, quantity } = req.params;

	cManager.addProductToCart(parseInt(pid), parseInt(cid), parseInt(quantity)).then((data) => {
		res.status(200).send({ origin: 'addProductToCart post', payload: data });
	});
});

export default router;
