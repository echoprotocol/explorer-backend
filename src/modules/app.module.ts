import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

import { EchojsModule } from './echojs/echojs.module';
import { GraphQLModule } from './graphql/graphql.module';
import { ApiModule } from './api/api.module';

@Global()
@Module({
	imports: [
		MongooseModule.forRoot(
			'mongodb://127.0.0.1:27017/explorer',
			{
				useNewUrlParser: true,
				useFindAndModify: true,
			},
		),
		EchojsModule.forRoot(config.url),
		GraphQLModule.forRoot(config.echodb.http_url),
		ApiModule,
	],
	exports: [
		EchojsModule,
		GraphQLModule,
	],
})
export class AppModule {}
