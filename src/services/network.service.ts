import { Injectable, Inject } from '@nestjs/common';
import { Echo } from 'echojs-lib';
import * as geoip from 'geoip-lite';

import { TOKEN_ECHOJS, PATH_TO_ICONS, PATH_TO_PUBLIC } from '../constants/global.constans';

@Injectable()
export class NetworkService {

	constructor(
		@Inject(TOKEN_ECHOJS) private echojsService: Echo,
	) {}

	async getConnectedPeers() {
		const peers = await this.echojsService.api.getConnectedPeers();

		return peers.map(({ host }) => geoip.lookup(host.split(':')[0]));

	}

	async getPotentialPeers() {
		const peers = await this.echojsService.api.getPotentialPeers();

		return peers.map(({ endpoint }) => geoip.lookup(endpoint.split(':')[0]));
	}

}
