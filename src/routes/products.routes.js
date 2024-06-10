import { Router } from 'express';
import config from '../config.js';
import productManager from '../productManager.js';
import productsModel from '../dao/models/products.model.js';

const router = Router();

//* ATLAS MONGOOSE
router.get('/db/products', async (req, res) => {
	try {
		const productsDB = await productsModel.find().lean();
		console.log(await productsModel.countDocuments());
		res.status(200).send({ origin: 'get from DB', payload: productsDB });
	} catch (e) {
		res.status(500).send({ origin: 'get from DB', payload: null, error: e });
	}
});

router.get('/db/products/one/:id', async (req, res) => {
	try {
		const productDB = await productsModel.findById(req.params.id);
		res.status(200).send({ origin: 'get one from DB ', payload: productDB });
	} catch (e) {
		res.status(500).send({ origin: 'get from DB', payload: null, error: e });
	}
});

router.post('/db/products', async (req, res) => {
	try {
		const newProduct = req.body;
		await productsModel.create(newProduct);
		res.status(200).send({ origin: 'post one from DB ', payload: newProduct });
	} catch (e) {
		res.status(500).send({ origin: 'post from DB', payload: null, error: e });
	}
});

//* FILE SYSTEM
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
	socketServer.emit('newProductConfirmation', newProduct);

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
