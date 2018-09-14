import express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

class App {
	public express: express.Application;
	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}
	private middleware(): void {
		this.express.use(express.static('dist'));
		this.express.use(bodyParser.urlencoded({ extended: true }));
		this.express.use(bodyParser.json());
	}
	private routes() {
		this.express.get('/', (req: express.Request, res: express.Response) => {
			res.sendFile(path.join(__dirname, 'index.html'));
		});
	}
}

export default new App().express;
