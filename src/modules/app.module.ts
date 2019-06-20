import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiModule } from './api/api.module';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://127.0.0.1:27017/explorer', { useNewUrlParser: true }),
		ApiModule,
	],
})

export class AppModule {}
