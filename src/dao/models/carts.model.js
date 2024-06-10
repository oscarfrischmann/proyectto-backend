import mongoose from 'mongoose';
import productsModel from './products.model.js';
import usersModel from './users.model.js';

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
	_user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
	products: { type: [{ _id: mongoose.Schema.Types.ObjectId, qty: Number }], required: true, ref: 'products' },
});

schema.pre('find', function () {
	this.populate({ path: '_user_id', model: usersModel }).populate({ path: 'products._id', model: productsModel });
});
const model = mongoose.model(collection, schema);

export default model;
