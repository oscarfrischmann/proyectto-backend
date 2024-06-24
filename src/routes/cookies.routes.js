import { Router } from 'express';
import config from '../config.js';

const router = Router();

router.get('/getcookie', async (req, res) => {
	try {
		const dataRecuperadaDeCookies = JSON.parse(req.signedCookies['CoderCookie']);
		res.status(200).send({ origin: 'getcookie', payload: dataRecuperadaDeCookies });
	} catch (err) {
		res.status(500).send({ origin: 'error getcookie', payload: null, error: err });
		throw new Error(err);
	}
});

router.get('/setcookie', async (req, res) => {
	try {
		const cookie = { cookie: 'Number One', from: 'Formulario front', JSON: 'parse y stringify' };
		res.cookie('CoderCookie', JSON.stringify(cookie), { maxAge: 10000, signed: true });
		res.status(200).send({ origin: 'setcookie', payload: 'Cookie Generada' });
	} catch (err) {
		res.status(500).send({ origin: 'setcookie', payload: null, error: err });
		throw new Error(err);
	}
});
router.get('/deletecookie', async (req, res) => {
	try {
		res.clearCookie('CoderCookie');
		res.status(200).send({ origin: 'deletecookie', payload: 'CoderCookie eliminada' });
	} catch (err) {
		res.status(500).send({ origin: 'deletecookie', payload: null, error: err });
		throw new Error(err);
	}
});
export default router;
