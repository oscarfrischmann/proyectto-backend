import { Router } from 'express';
import usersModel from '../dao/models/users.model.js';

const router = Router();

router.get('/db/users', async (req, res) => {
	try {
		// const usersDB = await usersModel.find().lean();
		// const usersDB = await usersModel.find().skip(5).limit(5).lean(); //.explain('executionStats')//;
		const usersDB = await usersModel.find().lean();

		console.log(await usersModel.countDocuments());
		res.status(200).send({ origin: 'get from DB users', payload: usersDB });
	} catch (err) {
		res.status(500).send({ origin: 'get from DB users', payload: err });
	}
});

router.get('/db/aggreg', async (req, res) => {
	try {
		const process = await usersModel.aggregate([
			{ $match: { role: 'Male' } },
			{ $group: { _id: '$region', totalGrade: { $sum: '$grade' } } },
			{ $sort: { totalGrade: -1 } },
		]);
		res.status(200).send({ origin: 'get aggregate', payload: process });
	} catch (err) {
		res.status(500).send({ origin: 'get aggregate', payload: err });
	}
});

router.get('/db/paginate/:role', async (req, res) => {
	const role = req.params.role;
	try {
		const process = await usersModel.paginate({}, { limit: 50, page: 2 });
		res.status(200).send({ origin: 'get paginate', payload: process });
	} catch (err) {
		res.status(500).send({ origin: 'get paginate', payload: err });
	}
});
export default router;
