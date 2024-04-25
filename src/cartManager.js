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
		this.carts = await this.getCarts();
		const result = await this.carts.find((cart) => cart.cid === cid);
		if (result) {
			return this.carts.find((c) => c.cid === cid);
		} else {
			return 'No such cart in the database.';
		}
	}

	async createCart() {
		try {
			const id = this.carts.length ? this.carts.length : 0;
			const newCart = { cid: id + 1, products: [] };
			this.carts.push(newCart);
			await fs.promises.writeFile(this.file, JSON.stringify(this.carts)), 'utf-8';
			return `Cart created with ID ${newCart.id}`;
		} catch (e) {
			console.log('error creating cart::'.e);
		}
	}

	async addProductToCart(pid, cid, quantity) {
		try {
			this.carts = await this.getCarts();
			let newCarts;

			const product = await productManager.getProductsById(pid);
			this.carts = this.carts.map((c, i) => {
				if (c.cid === cid) {
					if (c.products < 1) {
						c.products.push({ ...product, quantity: quantity });
					} else {
						console.log('product', product);
						if (c.products[0].id === product.id) {
							console.log('whatatatsdhsaghkdsajhdksahdh', c.products[0].id);

							c.products.push({ ...product, quantity: c.products[0].quantity + quantity });
							const find = c.products.find((element) => element.id === pid);
							const index = c.products.indexOf(find);
							console.log(index, 'findddddd');
							c.products.splice(index, 1);
						} else {
							c.products.push({ ...product, quantity: quantity });
						}
					}
					console.log(c);
				}
				newCarts = this.carts;
			});

			await fs.promises.writeFile(this.file, JSON.stringify(newCarts));
			return `Updated the cart with the id of "${cid}"`;
		} catch (e) {
			console.log(e);
		}
	}
}

const handleCart = new CartManager(`${config.DIRNAME}carts.json`);

const testOK = async () => {
	await handleCart.createCart();
	await handleCart.createCart();
	await handleCart.createCart();
	await handleCart.addProductToCart(0, 1, 2);
	await handleCart.addProductToCart(1, 2, 3);
	await handleCart.addProductToCart(2, 3, 4);
	await handleCart.addProductToCart(2, 3, 4);
	await handleCart.addProductToCart(2, 3, 4);
	await handleCart.addProductToCart(0, 1, 2);
	await handleCart.addProductToCart(0, 1, 2);
	await handleCart.addProductToCart(1, 1, 2);

	console.log(await handleCart.getCarts(3));
	// console.log(await handleCart.getCartByCid(1));
};

testOK();
export default CartManager;
