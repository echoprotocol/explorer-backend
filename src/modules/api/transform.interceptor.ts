import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {

	// @ts-ignore
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		return next.handle().pipe(map((data) => classToPlain(data)));
	}

}
