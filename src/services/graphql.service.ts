import { Injectable, Inject } from '@nestjs/common';

import { QUERY } from '../constants/graphql.constants';
import { TOKEN_GRAPHQL } from '../constants/global.constans';

@Injectable()
export class GraphQLService {

	constructor(
		@Inject(TOKEN_GRAPHQL) private client,
	) {}

	async getContractCreateOperation(id) {
		const {
			data: {
				getHistory: { items: [createOperation] },
			},
		} = await this.client.query({
			query: QUERY.GET_HISTORY,
			variables: {
				contracts: [id],
				operations: ['CONTRACT_CREATE'],
			},
		});

		return {
			...createOperation.body,
			...createOperation.transaction.block,
			result: createOperation.result,
		};
	}

}
