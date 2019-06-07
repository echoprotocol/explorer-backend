import { Injectable } from '@nestjs/common';

import { Contract } from '../interfaces/model.interfaces';
import { ContractRepository } from '../repositories/contract.repository';

@Injectable()
export class ContractService {
	constructor(private readonly contractRepository: ContractRepository) {}

	async getContracts(form?: Object): Promise<Contract[]> {
		return await this.contractRepository.find();
	}
}
