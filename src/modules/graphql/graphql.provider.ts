import ApolloClient from 'apollo-boost';
import fetcher from 'isomorphic-fetch';

import { TOKEN_GRAPHQL } from '../../constants/global.constans';

export const getGraphQLProvider = (url) => {
	return {
		provide: TOKEN_GRAPHQL,
		useFactory: async () => {
			return new ApolloClient({
				uri: url,
				fetchOptions: {
					fetch: fetcher,
				},
			});
		},
	};
};
