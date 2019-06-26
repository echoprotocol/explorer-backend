import * as Joi from '@hapi/joi';

import { BaseValidator } from './base.validator';

import { GLOBAL_CONSTANS } from '../../../constants/global.constans';

export class ContractValidator extends BaseValidator {

	static contractIdSchema(): object {
		return Joi.string().required().regex(new RegExp(`^${GLOBAL_CONSTANS.CONTRACT_PREFIX}[0-9]+$`), 'contract id');
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

}
