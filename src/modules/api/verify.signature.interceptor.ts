import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Echo, PublicKey, ED25519 } from 'echojs-lib';
import { TOKEN_ECHOJS } from '../../constants/global.constans';

@Injectable()
export class VerifySignatureInterceptor implements NestInterceptor {
	constructor(@Inject(TOKEN_ECHOJS) private echojsService: Echo) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
	  const { body } = context.switchToHttp().getRequest();
	  const { signature, message, accountId } = body;
	  const account = (await this.echojsService.api.getFullAccounts([accountId]))[0];

		if (!account) {
		  throw new NotFoundException('Account not found');
	  }

		const bufferPublicKey = PublicKey.fromPublicKeyString(account.active.key_auths[0][0]).toBuffer();
		const messageIsVerify = ED25519.verifyMessage(Buffer.from(signature, 'hex'), Buffer.from(message, 'utf8'), bufferPublicKey);

		if (!messageIsVerify) {
		  throw new BadRequestException('Signature is invalid.');
	  }

		return next.handle();
	}

}
