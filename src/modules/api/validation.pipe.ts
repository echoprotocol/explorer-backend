import * as Joi from 'joi';
import { PipeTransform } from '@nestjs/common';

import ValidationError from '../../errors/validation.error';

class ValidationPipe implements PipeTransform {
	private readonly schema: object;

	constructor(schema) {
		this.schema = schema;
	}

	transform(value: any) {
		const { error } = Joi.validate(value, this.schema, { abortEarly: false });

		if (error) {
			const details = error.details.map(({ message, path }) => ({
				message,
				value: path.join('.'),
			}));
			throw new ValidationError(details);
		}
		return value;
	}
}

export function setValidationPipe(schema: object) {
	return new ValidationPipe(schema);
}
