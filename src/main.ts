import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as config from 'config';
import { join } from 'path';

import { AppModule } from './modules/app.module';
import { PATH_TO_PUBLIC } from './constants/global.constans';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
	);

	app.useStaticAssets(join(__dirname, '..', PATH_TO_PUBLIC), { prefix: '/public/' });

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
