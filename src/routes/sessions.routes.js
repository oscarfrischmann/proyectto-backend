import { Router } from 'express';
import config from '../config.js';

const router = Router();

router.get('/counter', async (req, res) => {
	try {
		if (req.session.counter) {
			req.session.counter++;
			res.status(200).send({ origin: 'sessions', payload: `Visitas: ${req.session.counter}` });
		} else {
			req.session.counter = 1;
			res.status(200).send({ origin: 'sessions', payload: 'Primera visita' });
		}
	} catch (err) {
		res.status(500).send({ origin: 'error session', payload: null, error: err });
	}
});

router.get('/login', async (req, res) => {
	try {
		const user = { user: 'oscaritp', password: '123' };

		const savedUser = 'oscaritp';
		const savedPassword = '123';
		const savedName = 'Oscar';
		const savedEmail = 'oscarfrisc@gmail.com';
		const savedRole = 'admin';

		if (user.user !== savedUser || user.password !== savedPassword) {
			return res.status(401).send({ origin: 'login err', payload: 'Datos erróneos' });
		}
		req.session.user = { user: savedUser, name: savedName, email: savedEmail, role: savedRole };
		res.status(200).send({ origin: 'sessions', payload: 'Bienvenido USER premium' });
	} catch (err) {
		res.status(500).send({ origin: 'error login', payload: null, error: err });
	}
});
router.get('/logout', async (req, res) => {
	try {
	} catch (err) {
		res.status(500).send({ origin: 'error logout', payload: null, error: err });
	}
});

router.get('/private', async (req, res) => {
	try {
		console.log(req.session.user);
		if (req.session.user.role !== 'admin') {
			return res.status(403).send({ origin: 'private err', payload: 'No tiene premisos. Paga ADMIN!' });
		}
		res.status(200).send({ origin: 'private', payload: 'Acceso permitido, bienvenido ADMIN' });
	} catch (err) {
		res.status(500).send({ origin: 'error private', payload: null, error: err });
	}
});
export default router;
