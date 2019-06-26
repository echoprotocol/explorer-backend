import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cors from 'cors';
import * as config from 'config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	if (config.cors) {
		const corsOptions = {
			origin: (origin, callback) => {
				callback(null, true);
			},
			credentials: true,
			methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
			headers: ['x-user', 'X-Signature', 'accept', 'content-type'],
		};

		app.use(cors(corsOptions));
	}

	await app.listen(3000);
}
bootstrap();
