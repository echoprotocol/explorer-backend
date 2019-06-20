import * as Joi from '@hapi/joi';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import PipeError from '../../errors/pipe.error';
import { IJoi } from '../../interfaces/joi.interfaces';

@Injectable()
export class ApiPipe<T extends IJoi> implements PipeTransform {
	private readonly schema: IJoi;

	constructor(type: (new () => T)) {
		this.schema = (new type());
	}

	transform(value: any, metadata: ArgumentMetadata) {
		const { error } = Joi.validate(value, this.schema.getValidateObject()[metadata.type]);
		if (error) {
			throw new PipeError(error.details);
		}
		return value;
	}
}
