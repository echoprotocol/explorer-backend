import { BadRequestException } from '@nestjs/common';

declare type FormErrorDetail = {
	field: string,
	message: string,
	context: { [key: string]: string | number },
};

export default class FormError extends BadRequestException {
	private pDetails: FormErrorDetail[] = [];

	constructor(details?: FormErrorDetail[]) {
		super();

		this.pDetails = details;
	}

	get details() { return this.pDetails; }

}
