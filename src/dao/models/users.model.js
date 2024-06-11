import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true, index: true },
	email: { type: String, required: true },
	password_: { type: String, required: true },
	role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
	// role: { type: String, enum: ['Male', 'Female', 'Bigender'], default: 'Male' },
	// grade: { type: Number, required: true },
	// region: {
	// 	type: String,
	// 	enum: [
	// 		'United States',
	// 		'Sweden',
	// 		'Indonesia',
	// 		'Lithuania',
	// 		'Poland',
	// 		'China',
	// 		'Netherlands',
	// 		'Dominican Republic',
	// 		'Greece',
	// 		'Israel',
	// 		'Egypt',
	// 		'Russia',
	// 		'Tanzania',
	// 		'Thailand',
	// 	],
	// 	default: 'China',
	// },
});

schema.plugin(mongoosePaginate);

const model = mongoose.model(collection, schema);

export default model;
