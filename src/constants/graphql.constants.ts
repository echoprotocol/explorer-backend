import gql from 'graphql-tag';

export const HTTP_LINK = 'https://645-echodb.pixelplex-test.by/graphql';
export const OPERATION_DEFINITION = 'OperationDefinition';
export const SUBSCRIPTION = 'subscription';

const GET_HISTORY = gql`
query($contracts: [ContractId!], $operations: [OperationIdEnum!]) {
  	getHistory(contracts: $contracts, operations: $operations) {
		items {
			id
			body
			transaction {
				block {
					round
				}
			}
			result
		}
	}

}
`;

export const QUERY = { GET_HISTORY };
