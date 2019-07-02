import { Module } from '@nestjs/common';
import * as config from 'config';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiModule } from './api/api.module';

@Module({
	imports: [
		MongooseModule.forRoot(config.dbUrl, { useNewUrlParser: true }),
		ApiModule,
	],
})
export class AppModule {}
