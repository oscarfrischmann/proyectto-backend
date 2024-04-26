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

	// async addProductToCart(pid, cid, quantity) {
	// 	try {
	// 		this.carts = await this.getCarts();
	// 		console.log(this.carts);
	// 		let newCarts;

	// 		const product = await productManager.getProductsById(pid);
	// 		this.carts = this.carts.map((c, i) => {
	// 			if (c.cid === cid) {
	// 				if (c.products.length < 1) {
	// 					c.products.push({ ...product, quantity: quantity });
	// 				} else {
	// 					console.log(`Más de 1 producto en carrito ${cid}`);
	// 					if (c.products[i].id === product.id) {
	// 						// console.log('whatatatsdhsaghkdsajhdksahdh', c.products[0].id);
	// 						console.log(`En el carrito ${cid} ya hay producto ${pid}`);

	// 						c.products.push({ ...product, quantity: c.products[i].quantity + quantity });
	// 						const find = c.products.find((element) => element.id === pid);
	// 						const index = c.products.indexOf(find);
	// 						// console.log(index, 'findddddd');
	// 						c.products.splice(index, 1);
	// 					} else {
	// 						console.log(`Como en el carrrito ${cid} NO HAY producto ${pid}`);

	// 						c.products.push({ ...product, quantity: quantity });
	// 					}
	// 				}
	// 				// console.log(c);
	// 			}
	// 			newCarts = this.carts;
	// 		});

	// 		await fs.promises.writeFile(this.file, JSON.stringify(newCarts));
	// 		return `Updated the cart with the id of "${cid}"`;
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }

	/* 
	1- buscar todos los carritos 
	2. buscar el producto
	3. buscar si en el carrito hay productos
	4. si no hay productos, agregar el producto como está (+ quantity)
	5. si hay productos, validar que sea del mismo producto y sumarle a la cantidad
	6. si es distinto, crear un nuevo producto con esa informacion y sumarlo al carrito
	7. guardar todo en el archivo
	
	*/

	async addProductToCart(pid, cid, quantity) {
		try {
			const carts = await this.getCarts(); /*.then((data) => (this.carts = data))*/
			let productToAdd = await productManager.getProductsById(Number(pid));
			let updatetCart;
			carts.forEach((cart, i) => {
				if (cart.cid === Number(cid)) {
					// updatetCartIndex = cart.findIndex((p) => p.cid == cid);
					// console.log(updatetCartIndex);
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

		// async addProductToCart(pid, cid, quantity) {
		// 	try {
		// 		const carts = await this.getCarts();
		// 		const productToAdd = await productManager.getProductsById(Number(pid));

		// 		// Find the cart with the matching cid
		// 		const cartToUpdate = carts.find((cart) => cart.cid === Number(cid));
		// 		console.log(cartToUpdate, 'cartstoupdate');
		// 		if (cartToUpdate) {
		// 			// Check if the product already exists in the cart
		// 			const existingProduct = cartToUpdate.products.find((product) => product.pid === Number(pid));
		// 			if (existingProduct) {
		// 				console.log(existingProduct, 'ahhhhhhhhhhhhhhhhh');
		// 				// If the product exists, update its quantity
		// 				console.log('extstts');
		// 				existingProduct.quantity += quantity;
		// 			} else {
		// 				// If the product doesn't exist, add it to the cart
		// 				cartToUpdate.products.push({ ...productToAdd, quantity });
		// 			}
		// 		}

		// 		// Save the updated carts to the file
		// 		await fs.promises.writeFile(this.file, JSON.stringify(carts));
		// 		return `Updated the cart with the id of "${cid}"`;
		// 	} catch (error) {
		// 		console.error('ERROR addProductToCart:', error);
		// 	}
		// }
	}
}

const handleCart = new CartManager(`${config.DIRNAME}carts.json`);

const testOK = async () => {
	await handleCart.createCart();
	await handleCart.createCart();
	await handleCart.createCart();
	await handleCart.addProductToCart(0, 1, 2);
	// await handleCart.addProductToCart(0, 1, 2);
	await handleCart.addProductToCart(1, 2, 3);
	// await handleCart.addProductToCart(1, 2, 3);
	await handleCart.addProductToCart(2, 3, 4);
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
