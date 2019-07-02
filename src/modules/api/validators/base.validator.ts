import * as Joi from '@hapi/joi';

export class BaseValidator {

	static string(): Joi {
		return Joi.string();
	}

	static array(): Joi {
		return Joi.array();
	}

	static boolean(): Joi {
		return Joi.boolean();
	}

	static number(): Joi {
		return Joi.number();
	}

	static binary(): Joi {
		return Joi.binary();
	}

}
