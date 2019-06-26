import { Module, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import ContractModel from '../../models/contract.model';

import { ContractController } from './controllers/contract.controller';

import { ContractRepository } from '../../repositories/contract.repository';

import { ContractHelper } from '../../helpers/contract.helper';

import { ContractSerializer } from '../../serializers/contract.serializer';

import { ContractService } from '../../services/contract.service';
import { GraphQLService } from '../../services/graphql.service';
import { RavenService } from '../../services/raven.service';

import { LoggerInterceptor } from './logger.interceptor';
import { TransformInterceptor } from './transform.interceptor';
import { ApiExceptionFilter } from './exception.filter';

@Module({
	imports:[
		ContractModel,
	],
	controllers: [
		ContractController,
	],
	providers: [
		ContractRepository,

		ContractHelper,

		ContractService,
		GraphQLService,
		RavenService,

		{
			provide: 'IContractSerializer',
			useClass: ContractSerializer,
		},

		Logger,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggerInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: ApiExceptionFilter,
		},
	],
})
export class ApiModule {}
