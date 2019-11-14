export class LikedContractDto {
	signature: string;
	contractId: string;
	accountId: string;
	message: string;
}

export class VerifyContractDto {
	id: string;
	name: string;
	compiler_version: {
		urls: [string];
		path: string;
		version?: string;
		build: string;
		longVersion: string;
		keccak256: string;
	};
	inputs: [{
		arg: string;
		type: string;
	}];
	source_code: string;
}

export class SetContractAbiDto {
	id: string;
	abi: [{
		type: string;
		name: string;
		inputs: [{
			name: string;
			type: string;
			components: {
				name: string;
				type: string;
			};
			indexed: boolean;
		}];
		outputs: [{
			name: string;
			type: string;
			components: {
				name: string;
				type: string;
			};
		}];
		payable: boolean;
		stateMutability: string;
		constant: boolean;
		anonymous: boolean;
	}];
}

export class SearchContractsDto {
	name: string;
	offset?: number;
	limit?: number;
}
