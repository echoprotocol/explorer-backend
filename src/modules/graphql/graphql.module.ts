import { DynamicModule } from '@nestjs/common';
import { getGraphQLProvider } from './graphql.provider';
import { TOKEN_GRAPHQL } from '../../constants/global.constans';

export class GraphQLModule {
	static forRoot(url: string): DynamicModule {

		const provider = getGraphQLProvider(url);

		return {
			module: GraphQLModule,
			providers: [provider],
			exports: [TOKEN_GRAPHQL, provider],
		};
	}
}
