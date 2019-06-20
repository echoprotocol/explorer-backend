import { Module, Logger } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import ContractModel from '../../models/contract.model';

import { ContractController } from './controllers/contract.controller';

import { ContractRepository } from '../../repositories/contract.repository';

import { ContractService } from '../../services/contract.service';
import { RavenService } from '../../services/raven.service';

import { ApiInterceptor } from './api.interceptor';
import { TransformInterceptor } from './transform.interceptor';
import { ApiExceptionFilter } from './api.filter';
import { ContractEntity } from './schema/serializer.contract.schema';

@Module({
	imports:[
		ContractModel,
	],
	controllers: [
		ContractController,
	],
	providers: [
		ContractRepository,

		ContractService,
		RavenService,
		Logger,
		ContractEntity,
		{
			provide: 'ISerializerContract',
			useClass: ContractEntity,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ApiInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: ApiExceptionFilter,
		},
	],
})
export class ApiModule {}
