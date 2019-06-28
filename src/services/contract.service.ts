import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ContractRepository } from '../repositories/contract.repository';
import { LikedContractDto } from '../modules/api/dtos/contract.dtos';
import { ED25519, PublicKey, Echo } from 'echojs-lib';
import { TOKEN_ECHOJS } from '../constants/global.constans';
import { IContractModel } from '../interfaces/contract.interfaces';
import { ContractHelper } from '../helpers/contract.helper';

import { GraphQLService } from './graphql.service';

@Injectable()
export class ContractService {
	constructor(
		@Inject(TOKEN_ECHOJS) private echojsService: Echo,
		private readonly contractRepository: ContractRepository,
		private readonly contractHelper: ContractHelper,
		private readonly graphqlService: GraphQLService,
	) {}

	async likeContract(likeContract: LikedContractDto) {
		const { contractId, accountId } = likeContract;

		let contract: object = (await this.echojsService.api.getObject(contractId)) as object;

		if (!contract) {
			throw new NotFoundException('Contract not found');
		}

		contract = await this.contractRepository.findById(contractId, '', { lean: true });

		if (!contract) {
			contract = (await this.contractRepository.create({ _id: contractId })).save();
		}

		const users_has_liked = contract['users_has_liked'];

		if (!users_has_liked.includes(accountId)) {
			users_has_liked.push(accountId);
		} else {
			users_has_liked.splice(users_has_liked.indexOf(accountId), 1);
		}

		return this.contractRepository.findByIdAndUpdate(contractId, { users_has_liked }, { lean: true, new: true  });
	}

	async getOneContact(id: string): Promise<IContractModel> {
		return this.contractRepository.findById(id, '', { lean: true });
	}

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

}
