import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseMongoRepository } from './base-mongo.repository';

import { IContractModel } from '../interfaces/contract.interfaces';
import { RavenService } from '../services/raven.service';

import { Contract } from '../core/contract';

export class ContractRepository extends BaseMongoRepository {

	constructor(
		@InjectModel('Contract') private readonly contractModel: Model<IContractModel>,
		private readonly pRavenService: RavenService,
	) {
		super(pRavenService, contractModel);
	}

	/**
	 * @method findById
	 * @param {number} id
	 * @return {Promise<Contract|null>}
	 */
	async findContractById(id) {
		const data = await this.findById(id);
		return !data ? null : new Contract(data);
	}
}
