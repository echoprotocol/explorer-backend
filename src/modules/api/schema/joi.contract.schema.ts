import * as Joi from '@hapi/joi';
import { GLOBAL_CONSTANS } from '../../../constants/global.constans';
import { IJoi } from '../../../interfaces/joi.interfaces';

export class ContractIdSchema implements IJoi {

	getValidateObject(): object {
		return {
			param: Joi.string().regex(new RegExp(`^${GLOBAL_CONSTANS.CONTRACT_PREFIX}[0-9]+$`)),
		};
	}

}
