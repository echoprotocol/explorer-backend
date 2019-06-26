import { BadRequestException } from '@nestjs/common';

declare type ValidationErrorDetail = {
	value: string,
	message: string,
};

export default class ValidationError extends BadRequestException {
	private pDetails: ValidationErrorDetail[] = [];

	constructor(details?: ValidationErrorDetail[]) {
		super();

		this.pDetails = details;
	}

	get details() { return this.pDetails; }

}
