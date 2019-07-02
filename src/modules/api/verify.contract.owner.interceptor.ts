import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	Inject,
	UnauthorizedException,
} from '@nestjs/common';
import { Echo } from 'echojs-lib';
import { TOKEN_ECHOJS } from '../../constants/global.constans';

@Injectable()
export class VerifyContractOwnerInterceptor implements NestInterceptor {
	constructor(@Inject(TOKEN_ECHOJS) private echojsService: Echo) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
		const ctx = context.switchToHttp();
		const { body, params: { id: contractId } } = ctx.getRequest();

		const { accountId } = body;
		const contract = (await this.echojsService.api.getObject(contractId)) as any;

		if (contract['owner'] !== accountId) {
			throw new UnauthorizedException('User must be owner contract.');
		}

		return next.handle();
	}
}
