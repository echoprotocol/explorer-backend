import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseMongoRepository } from './base-mongo.repository';

import { Contract } from '../interfaces/model.interfaces';
import { RavenService } from '../services/raven.service';

export class ContractRepository extends BaseMongoRepository {

	constructor(
		@InjectModel('Contract') private readonly contractModel: Model<Contract>,
		private readonly pRavenService: RavenService,
	) {
		super(pRavenService, contractModel);
	}

}
