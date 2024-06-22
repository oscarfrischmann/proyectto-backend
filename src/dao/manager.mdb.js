import productsModel from './models/products.model.js';

class ProductManager {
	constructor() {}

	async getAll(limit) {
		try {
			return await productsModel.find().limit(parseInt(limit)).lean();
		} catch (err) {
			throw new Error('ID Not Found', e);
		}
	}

	async getById(id) {
		try {
			return await productsModel.findById(id).lean();
		} catch (err) {
			throw new Error('get by id', err);
		}
	}

	async add(newProduct) {
		try {
			return await productsModel.create(newProduct);
		} catch (err) {
			throw new Error('Error adding product', err);
		}
	}

	async update(id, update, options) {
		try {
			return await productsModel.findByIdAndUpdate(id, update, options);
		} catch (err) {
			throw new Error('update error', err);
		}
	}

	async delete(id) {
		try {
			return await productsModel.findByIdAndDelete(id);
		} catch (err) {
			throw new Error('delete error', err);
		}
	}
}

export default ProductManager;
