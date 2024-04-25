import { Router } from 'express';
import config from '../config.js';
import productManager from '../productManager.js';
import cartManager from '../cartManager.js';

const router = Router();

const pManager = new productManager(`${config.DIRNAME}products.json`);
const cManager = new cartManager(`${config.DIRNAME}carts.json`);

router.get('/:cid', (req, res) => {
	const { cid } = req.params;
	cManager.getCartByCid(parseInt(cid)).then((data) => {
		res.status(200).send({ origin: 'getCart ByCid', payload: data });
	});
});

router.post('/:pid/:cid/:quantity', (req, res) => {
	let { pid, cid, quantity } = req.params;
	cManager.getCartByCid(parseInt(cid)).then((oldData) => {
		if (oldData.products.some((p) => p.id === +pid)) {
			const productToUpdate = oldData.products.find((p) => {
				p.id === parseInt(pid);
			});
			console.log(productToUpdate);
			cManager.addProductToCart(parseInt(pid), parseInt(cid), parseInt(quantity) + 1);
			res.status(200).send({ origin: 'addProductToCart post', payload: [] });
		}
	});
});

export default router;
