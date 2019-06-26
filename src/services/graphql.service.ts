import { Injectable } from '@nestjs/common';
import ApolloClient from 'apollo-boost';
import fetcher from 'isomorphic-fetch';

import { HTTP_LINK, QUERY } from '../constants/graphql.constants';

@Injectable()
export class GraphQLService {
	private client;

	constructor() {
		this.client = new ApolloClient({
			uri: HTTP_LINK,
			fetchOptions: {
				fetch: fetcher,
			},
		});
	}

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
