import productsModel from './models/products.model.js';

class ProductManager {
	constructor() {
		this.products = [];
	}

	async getAll(limit) {
		try {
			return await productsModel.find().limit(parseInt(limit)).lean();
		} catch (e) {
			throw new Error('ID Not Found', e);
		}
	}

	async getById() {
		try {
		} catch (e) {}
	}

	async add() {
		try {
		} catch (e) {}
	}

	async update() {
		try {
		} catch (e) {}
	}

	async delete() {
		try {
		} catch (e) {}
	}
}

export default ProductManager;
