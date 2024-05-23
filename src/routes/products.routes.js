import { Router } from 'express';
import config from '../config.js';
import productManager from '../productManager.js';

const router = Router();

const manager = new productManager(`${config.DIRNAME}/products.json`);

router.get('/api/products', (req, res) => {
	const limit = req.query.limit;
	manager.getProducts(limit).then((data) => {
		res.status(200).send({ origin: 'getLimit', payload: data });
	});
});

router.get('/api/product/:pid', (req, res) => {
	const { pid } = req.params;
	console.log(pid);
	manager.getProductsById(parseInt(pid)).then((data) => {
		res.status(200).send({ origin: 'getID', payload: data });
	});
});

router.post('/api/product', (req, res) => {
	//:title/:description/:price/:thumbnail/:code/:stock
	const socketServer = req.app.get('socketServer');
	const newProduct = req.body;
	const parse = { ...newProduct };
	manager.addProduct(parse);

	socketServer.on('newProduct', (data) => {
		console.log(data);
		socketServer.emit('newProductConfirmation', data);
	});
	res.status(200).send({ origin: 'post', payload: parse });
});

router.put('/:sid', (req, res) => {
	const { sid } = req.params;
	const id = +sid;
	const { description = '', title = '', stock, price } = req.body;
	manager.getProductsById(id).then((oldData) => {
		console.log(req.body);
		if (oldData === 'No such ID found') {
			res.status(400).send({ origin: 'put', payload: {}, error: 'ID inexistente' });
		} else {
			const updated = { ...oldData, ...req.body };
			manager.updateProduct(id, req.body);
			res.status(200).send({ origin: 'put', payload: req.body, body: updated });
		}
	});
});

router.delete('/api/product/:sid', (req, res) => {
	const { sid } = req.params;
	const id = +sid;
	manager
		.deleteProduct(id)
		.then(() => {
			res.status(200).send(`Produto ${id} removido`);
		})
		.catch((err) => {
			console.log('Error no delete: ', err);
			res.status(500).send(`No se puede borrar el producto con ID "${id}"`);
		});
});

export default router;
