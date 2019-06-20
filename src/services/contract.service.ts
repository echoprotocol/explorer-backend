import { Injectable, Inject } from '@nestjs/common';

import { Contract } from '../interfaces/model.interfaces';
import { ContractRepository } from '../repositories/contract.repository';

import { ContractEntity } from '../modules/api/schema/serializer.contract.schema';
import { ISerializerContract } from '../interfaces/serializer.contract.interface';

@Injectable()
export class ContractService {

	constructor(
		private readonly contractRepository: ContractRepository,
		@Inject('ISerializerContract') private contractEntity: ISerializerContract<ContractEntity>,
	) {}

	async getContracts(form?: Object): Promise<Contract[]> {
		return await this.contractRepository.find();
	}

	async getOneContact(id: string): Promise<ISerializerContract<ContractEntity>> {
		const contract = await this.contractRepository.findById(id, '', { lean: true });
		return this.contractEntity.getInstance(contract);
	}
}
