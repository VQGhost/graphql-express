  
import app from './app';
import https from 'https';
import fs from 'fs';
import { config } from 'dotenv';

config();
const options = {
	key: fs.readFileSync(process.env.SSL_KEY_FILE),
	cert: fs.readFileSync(process.env.SSL_CRT_FILE),
	requestCert: false,
	rejectUnauthorized: false,
};

https.createServer(options, app).listen(app.get('port'), () => {
	console.log(`App On port %s`, app.get('port'));
});