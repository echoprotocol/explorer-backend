import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import ContractModel from '../../models/contract.model';

import { ContractController } from './controllers/contract.controller';
import { AccountController } from './controllers/account.controller';

import { ContractRepository } from '../../repositories/contract.repository';

import { ContractHelper } from '../../helpers/contract.helper';

import { ContractSerializer } from '../../serializers/contract.serializer';

import { ContractService } from '../../services/contract.service';
import { AccountService } from '../../services/account.service';
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
		AccountController,
	],
	providers: [
		ContractRepository,

		ContractHelper,

		ContractService,
		AccountService,
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
