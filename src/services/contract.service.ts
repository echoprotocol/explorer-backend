import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { parseInputs } from 'echojs-contract';
import { Echo } from 'echojs-lib';
import * as solc from 'solc';
import * as https from 'https';
import { createWriteStream, pathExists, ensureDir, unlink } from 'fs-extra';
import * as config from 'config';
import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';
const accessFileAsync = promisify(fs.access);
const unlinkFileAsync = promisify(fs.unlink);

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
		let contract = await this.contractRepository.findContractById(contractId);

		if (!contract) {
			contract = await this.contractRepository.create({ _id: contractId });
		}

		if (file) {
			contractInfo.icon = `/${PATH_TO_PUBLIC}/${PATH_TO_ICONS}/${file['filename']}`;
		} else {
			const fullPathToIcon = join(__dirname, '../..', contract.icon);
			let isNotExistFile = false;
			try {
				await accessFileAsync(fullPathToIcon, fs.constants.F_OK);
			} catch (e) {
				isNotExistFile = true;
			}

			if (contract.icon && !isNotExistFile) {
				const resultDeleteFile = await unlinkFileAsync(fullPathToIcon);
			}
			contractInfo.icon = '';
		}

		return await this.contractRepository.findByIdAndUpdate(contractId, contractInfo, { lean: true, new: true });
	}

	async loadSolcBinary(fileName, url) {
		await ensureDir('solc-bins');

		if (await pathExists(`./solc-bins/${fileName}`)) {
			return fileName;
		}

		const file = createWriteStream(`./solc-bins/${fileName}`);

		return new Promise((res, rej) => {
			https.get(url, (response) => {
				response.pipe(file);
				file.on('close', () => {
					file.close();
					res(fileName);
				});
			  }).on('error', async (err) => {
				await unlink(fileName);
				return rej(err.message);
			  });
		});
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

		const { version, path } = compiler_version;
		const longVersion = `v${compiler_version.longVersion}`;

		try {
			await this.loadSolcBinary(path, `${config.solcBinUrl}${compiler_version.path}`);
		} catch (error) {
			throw new BadRequestException('Current solidity compiler cannot be downloaded');
		}

		const solcVersion = solc.setupMethods(require(`../../solc-bins/${path}`));

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

		const compiledBytecode = this.contractHelper.processBytecode(version, bytecode);
		const deployedBytecode = this.contractHelper.processBytecode(version, code);

		if (compiledBytecode !== deployedBytecode) {
			throw new BadRequestException('Invalid source code or compiler version');
		}

		const args = parseInputs(inputs);

		if (!code.includes(args)) {
			throw new BadRequestException('Invalid constructor arguments');
		}

		return await this.contractRepository.findByIdAndUpdate(id, {
			abi,
			source_code,
			compiler_version: longVersion,
			verified: true,
		}, { lean: true, new: true });

	}

	searchContracts(name: string, offset?: number, limit?: number) {
		return this.contractRepository.find(
			{ name: { $regex: new RegExp(`^${name}`, 'i') } },
			null,
			{ limit, skip: offset, lean: true },
		);
	}

}
