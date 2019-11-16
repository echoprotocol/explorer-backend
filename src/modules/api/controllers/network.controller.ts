import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { NetworkService } from '../../../services/network.service';

@Controller('api/network')
export class NetworkController {

	constructor(
		private readonly networkService: NetworkService,
	) {}

	@Get('peers')
	getPeers(@Query('connected') connected: boolean) {
		if (connected) {
			return this.networkService.getConnectedPeers();
		}

		return this.networkService.getPotentialPeers();
	}
}
