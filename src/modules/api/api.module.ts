import { Module, Logger } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import ContractModel from '../../models/contract.model';

import { ContractController } from './controllers/contract.controller';

import { ContractRepository } from '../../repositories/contract.repository';

import { ContractService } from '../../services/contract.service';
import { RavenService } from '../../services/raven.service';

import { ApiInterceptor } from './api.interceptor';
import { ApiExceptionFilter } from './api.filter';

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
		{
			provide: APP_INTERCEPTOR,
			useClass: ApiInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: ApiExceptionFilter,
		},
	],
})
export class ApiModule {}
