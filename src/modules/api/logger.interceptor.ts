import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as config from 'config';
import { Request } from 'express-serve-static-core';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	private logger = new Logger('api.interceptor');

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const request = ctx.getRequest();
		this.traceRequest(request);
		return next.handle();
	}

	private traceRequest(req: Request) {
		if (!config.traceApiRequests) return;

		const traceForm = { ...req.body, ...req.params, ...req.query };
		['password'].forEach((hiddableField) => {
			if (traceForm[hiddableField]) {
				traceForm[hiddableField] = traceForm[hiddableField].replace(/./ig, '*');
			}
		});

		this.logger.debug(`${req.method.toUpperCase()} Request ${req.originalUrl} - ${JSON.stringify(traceForm)}`);
	}
}
