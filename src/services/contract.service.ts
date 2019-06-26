import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { IContractModel } from '../interfaces/contract.interfaces';

import { ContractHelper } from '../helpers/contract.helper';
import { ContractRepository } from '../repositories/contract.repository';
import { GraphQLService } from './graphql.service';

@Injectable()
export class ContractService {
	constructor(
		private readonly contractRepository: ContractRepository,
		private readonly contractHelper: ContractHelper,
		private readonly graphqlService: GraphQLService,
	) {}

	async setContractAbi(id, abi): Promise<IContractModel> {
		let contract = await this.contractRepository.findById(id);

		if (!contract) {
			contract = await this.contractRepository.create({ _id: id });
		}

		const { code } = await this.graphqlService.getContractCreateOperation(id);

		const methods = abi
			.filter(({ type }) => type === 'function')
			.map(({ name, inputs }) => this.contractHelper.getMethodCode(name, inputs));

		if (methods.find((c) => !code.includes(c))) {
			throw new BadRequestException('Invalid ABI');
		}

		let oldMethods = [];

		if (contract.abi) {
			oldMethods = contract.abi
				.filter(({ type }) => type === 'function')
				.map(({ name, inputs }) => this.contractHelper.getMethodCode(name, inputs));
		}

		const diff = methods.filter((c) => !oldMethods.includes(c));

		if (diff.length && diff.length + oldMethods.length !== methods.length) {
			throw new BadRequestException('Current ABI has more information');
		}

		return await this.contractRepository.findByIdAndUpdate(id, { abi }, { lean: true, new: true });
	}

	getOneContact(id: string): Promise<IContractModel> {
		return this.contractRepository.findById(id, '', { lean: true });
	}
}
