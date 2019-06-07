import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as config from 'config';
import { Request } from 'express-serve-static-core';

import FormError from '../../errors/form.error';

@Injectable()
export class ApiInterceptor implements NestInterceptor {
	private logger = new Logger('api.interceptor');

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const request = ctx.getRequest();

		request.form = request.form || { isValid: true };
		this.traceRequest(request, request.form);

		if (!request.form.isValid) {
			throw new FormError(request.form.getErrors());
		}

		return next.handle();
	}

	private traceRequest(req: Request, form: Express.Request['form']) {
		if (!config.traceApiRequests) return;

		const traceForm = { ...form };
		['password'].forEach((hiddableField) => {
			if (form[hiddableField]) {
				traceForm[hiddableField] = form[hiddableField].replace(/./ig, '*');
			}
		});

		this.logger.debug(`${req.method.toUpperCase()} Request ${req.originalUrl} Form ${JSON.stringify(traceForm)}`);
	}
}
