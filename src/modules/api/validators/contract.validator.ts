import * as Joi from '@hapi/joi';

import { BaseValidator } from './base.validator';
import { ACCOUNT_PREFIX, CONTRACT_PREFIX } from '../../../constants/global.constans';

export class ContractValidator extends BaseValidator {

	static contractIdSchema(): object {
		return Joi.string().required().regex(new RegExp(`^${CONTRACT_PREFIX}[0-9]+$`), 'contract id');
	}

	static accountIdShema() {
		return Joi.string().required().regex(new RegExp(`^${ACCOUNT_PREFIX}[0-9]+$`), 'account id');
	}

	static contractAbiSchema(): object {
		return Joi.array().required().items(Joi.object({
			type: Joi.string().valid(['function', 'constructor', 'fallback', 'event']).required(),
			name: Joi.string().allow(''),
			inputs: Joi.array().items(Joi.object({
				name: Joi.string().allow(''),
				type: Joi.string().required(),
				components: Joi.array().items(Joi.object({
					name: Joi.string().allow(''),
					type: Joi.string().required(),
				})),
				indexed: Joi.boolean(),
			})),
			outputs: Joi.array().items(Joi.object({
				name: Joi.string().allow(''),
				type: Joi.string().required(),
				components: Joi.object({
					name: Joi.string().allow(''),
					type: Joi.string().required(),
				}),
			})),
			payable: Joi.boolean(),
			stateMutability: Joi.string().valid(['pure', 'view', 'nonpayable', 'payable']),
			constant: Joi.boolean(),
			anonymous: Joi.boolean(),
		})).min(1);
	}

	static contractInputsSchema(): object {
		return Joi.array().items(Joi.object({
			arg: Joi.string().required(),
			type: Joi.string().required(),
		}));
	}

	static updateContractSchema(): object {
		return Joi.object().keys({
			signature: Joi.string().required(),
			message: Joi.string().required(),
			accountId: ContractValidator.accountIdShema(),
			name: ContractValidator.string(),
			description: ContractValidator.string(),
			icon: ContractValidator.string(),
		});
	}

	static likedContractSchema(): object {
		return Joi.object().keys({
			signature: Joi.string().required(),
			message: Joi.string().required(),
			contractId: ContractValidator.contractIdSchema(),
			accountId: ContractValidator.accountIdShema(),
		});
	}

	static contractCompilerVersion(): object {
		return Joi.object().keys({
			path: Joi.string().required(),
			version: Joi.string().required(),
			build: Joi.string(),
			longVersion: Joi.string().required(),
			keccak256: Joi.string().required(),
			urls: Joi.array(),
		});
	}

}
