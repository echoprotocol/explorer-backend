import { Controller, Get, Param, Res } from '@nestjs/common';
import { AccountService } from '../../../services/account.service';

@Controller('api/accounts')
export class AccountController {

	constructor(
		private readonly accountService: AccountService,
	) {}

	@Get(':name/avatar.png')
	getAccountAvatar(@Param('name') name: string, @Res() res) {
		const buffer = this.accountService.getAccountAvatar(name);
		const stream = this.accountService.getReadableStream(buffer);

		res.set({
			'Content-Type': 'image/png',
			'Content-Length': buffer.length,
		});

		stream.pipe(res);
	}
}
