import { Router } from 'express';
import usersModel from '../dao/models/users.model.js';

const router = Router();

router.get('/db/users', async (req, res) => {
	try {
		// const usersDB = await usersModel.find().lean();
		const usersDB = await usersModel.find({ lastName: 'Fahey' }).explain('executionStats');

		console.log(await usersModel.countDocuments());
		res.status(200).send({ origin: 'get from DB users', payload: usersDB });
	} catch (err) {
		res.status(500).send({ origin: 'get from DB users', payload: err });
	}
});

export default router;
