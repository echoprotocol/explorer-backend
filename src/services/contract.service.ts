import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { parseInputs } from 'echojs-contract';
import { Echo } from 'echojs-lib';
import * as solc from 'solc';

import { TOKEN_ECHOJS, PATH_TO_ICONS, PATH_TO_PUBLIC } from '../constants/global.constans';
import { IContractModel } from '../interfaces/contract.interfaces';
import { LikedContractDto } from '../modules/api/dtos/contract.dtos';
import { ContractHelper } from '../helpers/contract.helper';
import { GraphQLService } from './graphql.service';
import { ContractRepository } from '../repositories/contract.repository';

@Injectable()
export class ContractService {
	constructor(
		@Inject(TOKEN_ECHOJS) private echojsService: Echo,
		private readonly contractRepository: ContractRepository,
		private readonly contractHelper: ContractHelper,
		private readonly graphqlService: GraphQLService,
	) {}

	async getOneContact(id: string): Promise<IContractModel> {
		return this.contractRepository.findById(id, '', { lean: true });
	}

	async updateContract(contractId: string, file: Object, contractInfo: any): Promise<IContractModel> {
		let contract = await this.contractRepository.findById(contractId);

		if (!contract) {
			contract = await this.contractRepository.create({ _id: contractId });
		}

		if (file) {
			contractInfo.icon = `/${PATH_TO_PUBLIC}/${PATH_TO_ICONS}/${file['filename']}`;
		}

		return await this.contractRepository.findByIdAndUpdate(contractId, contractInfo, { lean: true, new: true });
	}

	async likeContract(likeContract: LikedContractDto) {
		const { contractId, accountId } = likeContract;

		const contractInfo = await this.echojsService.api.getObject(contractId);

		if (!contractInfo) {
			throw new NotFoundException('Contract not found');
		}

		let contract = await this.contractRepository.findById(contractId, '', { lean: true });

		if (!contract) {
			contract = (await this.contractRepository.create({ _id: contractId }));
		}

		const { users_has_liked } = contract;

		if (!users_has_liked.includes(accountId)) {
			users_has_liked.push(accountId);
		} else {
			users_has_liked.splice(users_has_liked.indexOf(accountId), 1);
		}

		return this.contractRepository.findByIdAndUpdate(contractId, { users_has_liked }, { lean: true, new: true  });
	}

	async setContractAbi(id, abi): Promise<IContractModel> {
		let contract = await this.contractRepository.findById(id);

		if (!contract) {
			contract = await this.contractRepository.create({ _id: id });
		}

		if (contract.verified) {
			throw new BadRequestException('Contract has been already verified');
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

		if (!diff.length || diff.length + oldMethods.length !== methods.length) {
			throw new BadRequestException('ABI doesn\'t contain new methods');
		}

		return await this.contractRepository.findByIdAndUpdate(id, { abi }, { lean: true, new: true });
	}

	async verifyContract(source_code, id, name, compiler_version, inputs = []) {

		let contract = await this.contractRepository.findById(id);

		if (!contract) {
			contract = await this.contractRepository.create({ _id: id });
		}

		if (contract.verified) {
			throw new BadRequestException('Contract has been already verified');
		}

		const { code } = await this.graphqlService.getContractCreateOperation(id);

		const solcVersion: solc = await new Promise((resolve, reject) => {
			solc.loadRemoteVersion(compiler_version, (err: Error, solcVersion: solc) => {
				if (err) {
					reject(err);
				} else {
					resolve(solcVersion);
				}
			});
		});

		const output = JSON.parse(solcVersion.compile(JSON.stringify({
			language: 'Solidity',
			settings: {
				outputSelection: {
					'*': {
						'*': ['abi', 'evm.bytecode.object'],
					},
				},
			},
			sources: {
				source_code: {
					content: source_code,
				},
			},
		})));

		const errors = output.errors ? output.errors.filter(({ type }) => type !== 'Warning') : [];
		if (errors.length) {
			throw new Error('Compile error');
		}

		if (!output.contracts.source_code[name]) {
			throw new BadRequestException('Contract name invalid');
		}

		const {
			contracts: {
				source_code: {
					[name]: {
						abi, evm: { bytecode: { object: bytecode } },
					},
				},
			},
		} = output;

		if (!code.includes(bytecode)) {
			throw new BadRequestException('Invalid source code or compiler version');
		}

		const args = parseInputs(inputs);

		if (`${bytecode}${args}` !== code) {
			throw new BadRequestException('Invalid constructor arguments');
		}

		return await this.contractRepository.findByIdAndUpdate(id, {
			abi,
			compiler_version,
			source_code,
			verified: true,
		}, { lean: true, new: true });

	}
}
