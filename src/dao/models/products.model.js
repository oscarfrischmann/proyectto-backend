import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
	title: {},
	description: { type: String, required: true },
	price: { type: Number, required: true },
	thumbnail: { type: String, required: false },
	code: { type: String, required: true },
	stock: { type: Number, required: true },
});

const model = mongoose.model(collection, schema);

export default model;
