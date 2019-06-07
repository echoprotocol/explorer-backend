import { Logger, ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express-serve-static-core';

import FormError from '../../errors/form.error';
import { RavenService } from '../../services/raven.service';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
	private logger = new Logger('api.filter');

	constructor(private readonly ravenService: RavenService) {}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		if (!(exception instanceof HttpException) || !(exception instanceof FormError)) {
			this.sendError(request, response, new HttpException(
				exception instanceof Error ? exception.message : 'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			));
		} else {
			this.sendError(request, response, exception);
		}

	}

	private sendError(request: Request, response: Response, error: HttpException | FormError) {
		this.logger.error(error.message);
		this.ravenService.error(error.message, 'ApiExceptionFilter', {
			method: request.method,
			url: request.url,
			form: request.form,
			status: error.getStatus(),
		});

		return response.status(error.getStatus()).json({
			error: error instanceof FormError ? error.details : error.message,
			status: error.getStatus(),
		});
	}
}
