import fs from 'fs';
import config from './config.js';
import ProductManager from './productManager.js';

const productManager = new ProductManager(`${config.DIRNAME}/products.json`);

class CartManager {
	constructor(file) {
		this.carts = [];
		this.file = file;
	}

	async getCarts(limit) {
		try {
			this.carts = await fs.promises.readFile(this.file);
			let parseCarts = await JSON.parse(this.carts);
			return limit ? parseCarts.slice(0, limit) : parseCarts;
		} catch (e) {
			console.log('Error getting carts: ', e);
		}
	}

	async getCartByCid(cid) {
		try {
			this.carts = await this.getCarts();
			const result = await this.carts.find((cart) => cart.cid === cid);
			if (result) {
				return this.carts.find((c) => c.cid === cid);
			} else {
				return 'No such cart in the database.';
			}
		} catch (e) {
			console.log('Error getting cart by id', e);
		}
	}
	async createCart() {
		try {
			this.carts = await this.getCarts();

			const id = this.carts.length ? this.carts.length : 0;
			const newCart = { cid: id + 1, products: [] };
			this.carts.push(newCart);
			await fs.promises.writeFile(this.file, JSON.stringify(this.carts)), 'utf-8';
			return `Cart created with ID ${newCart.cid}`;
		} catch (e) {
			console.log('error creating cart::'.e);
		}
	}

	async addProductToCart(pid, cid, quantity) {
		try {
			const carts = await this.getCarts();
			let productToAdd = await productManager.getProductsById(Number(pid));
			let updatetCart;
			carts.forEach((cart, i) => {
				if (cart.cid === Number(cid)) {
					let index = cart.products.findIndex((p) => p.id == pid);
					if (index !== -1) {
						cart.products[index].quantity += quantity;
					} else {
						cart.products.push({ ...productToAdd, quantity: quantity });
					}
				}
				updatetCart = cart;
			});
			this.carts = carts;
			console.log(this.carts);
			await fs.promises.writeFile(this.file, JSON.stringify(carts));
			return updatetCart;
		} catch (e) {
			console.log('ERROR addProductToCart', e);
		}
	}
}

const handleCart = new CartManager(`${config.DIRNAME}carts.json`);

const testOK = async () => {
	// await handleCart.createCart();
	// await handleCart.createCart();
	// await handleCart.createCart();
	// await handleCart.addProductToCart(0, 1, 2);
	// await handleCart.addProductToCart(0, 1, 2);
	// await handleCart.addProductToCart(1, 2, 3);
	// await handleCart.addProductToCart(1, 2, 3);
	// await handleCart.addProductToCart(2, 3, 4);
	// await handleCart.addProductToCart(2, 3, 4);
	// await handleCart.addProductToCart(2, 3, 4);
	// await handleCart.addProductToCart(1, 3, 4);
	// await handleCart.addProductToCart(1, 3, 4);
	// await handleCart.addProductToCart(0, 1, 2);
	// await handleCart.addProductToCart(2, 1, 2);
	// await handleCart.addProductToCart(2, 1, 2);
	// await handleCart.addProductToCart(0, 1, 2);
	// await handleCart.addProductToCart(1, 1, 2);
	// await handleCart.addProductToCart(1, 1, 2);
	// console.log(await handleCart.getCarts(3));
	// console.log(await handleCart.getCartByCid(1));
};

// testOK();
export default CartManager;
