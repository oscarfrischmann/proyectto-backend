import * as url from 'url';

const config = {
	PORT: 8080,
	DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
	// Esta función tipo getter nos permite configurar dinámicamente
	// la propiedad UPLOAD_DIR en base al valor de otra propiedad (DIRNAME)
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
	get UPLOAD_DIR() {
		return `${this.DIRNAME}/public/img`;
	}, // Función getter
	MONGODB_URI: 'mongodb://127.0.0.1:27017/proyectto',
	ATLAS_URI: 'mongodb+srv://oscarfrisc:8B8NmzurFWopuw2U@proyectto.46qcvto.mongodb.net/proyectto',
	// MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
};

export default config;
