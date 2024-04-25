import fs from 'fs';
import config from './config.js';

class ProductManager {
	constructor(file) {
		this.products = [];
		this.file = file;
	}

	async addProduct(product) {
		this.products = await this.getProducts();

		let lastIndexOfProducts = this.products.length;
		product.id = lastIndexOfProducts++;

		if (Object.values(product).length <= 6) {
			console.log(`Incomplete Product: ${product.title} ${product.description} not added`);
		} else {
			if (this.products.some((code) => code === product.code)) {
				console.log(`The product with this code already exists.\n`);
			} else {
				this.products.push(product);
				await fs.promises.writeFile(this.file, JSON.stringify(this.products)), 'utf-8';
			}
		}
	}

	async getProducts(limit) {
		try {
			this.products = await fs.promises.readFile(this.file);
			let parseProducts = await JSON.parse(this.products);
			return limit ? parseProducts.slice(0, limit) : parseProducts;
		} catch (e) {
			console.log('getProducts()', e);
		}
	}

	async getProductsById(id) {
		this.products = await this.getProducts();
		const result = await this.products.find((p) => p.id === id);
		if (result) {
			return this.products.find((p) => p.id === id);
		} else {
			return 'No such ID found';
		}
	}

	async updateProduct(id, updates) {
		this.products = await this.getProducts();

		const product = this.products.find((prod) => prod.id === id);
		if (product) {
			this.products = this.products.map((prod) => {
				if (prod.id === id) {
					return { ...prod, ...updates };
				} else {
					return prod;
				}
			});
			await fs.promises.writeFile(this.file, JSON.stringify(this.products));
			return `Updated the product with the id of "${id}"`;
		} else {
			console.log('Invalid product ID');
		}
	}

	async deleteProduct(id) {
		try {
			this.products = await this.getProducts();

			let product = await this.products.find((product) => product.id === id);
			let index = await this.products.indexOf(product);

			await this.products.splice(index, 1);

			await this.products.forEach((prod, i) => {
				prod.id = i;
			});

			await fs.promises.writeFile(this.file, JSON.stringify(this.products));
			return `Deleted the product with the id of "${id}"`;
		} catch (e) {
			console.log('DELETE', e);
		}
	}
}

const product0 = {
	title: 'Agua',
	description: 'Fresca',
	price: 10,
	thumbnail: 'http://google.com',
	code: 'AGU01',
	stock: 1,
	path: './products.json',
};
const product1 = {
	title: 'Agua',
	description: 'Poco Fresca',
	price: 5,
	thumbnail: 'http://google.com',
	code: 'AGU02',
	stock: 5,
	path: './products.json',
};
const product2 = {
	title: 'Agua',
	description: 'Muy Dudosa',
	price: 2,
	thumbnail: 'http://google.com',
	code: 'AGU03',
	stock: 15,
	path: './products.json',
};

const manager = new ProductManager(`${config.DIRNAME}/products.json`);

const testOK = async () => {
	await manager.addProduct(product0);
	await manager.addProduct(product1);
	await manager.addProduct(product2);
	console.log('1', await manager.getProducts());
	console.log('2', await manager.getProductsById(1));
	console.log('3', await manager.updateProduct(1, { price: 7, stock: 8 }));
	console.log('4', await manager.getProductsById(1));
	// console.log('5', await manager.deleteProduct(0));
	console.log('6', await manager.getProducts());
};

// testOK();
export default ProductManager;
