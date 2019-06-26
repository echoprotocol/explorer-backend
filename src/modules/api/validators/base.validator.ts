import * as Joi from '@hapi/joi';

export class BaseValidator {

	static string(): object {
		return Joi.string();
	}

	static array(): object {
		return Joi.array();
	}

	static boolean(): object {
		return Joi.boolean();
	}

	static number(): object {
		return Joi.number();
	}

}
