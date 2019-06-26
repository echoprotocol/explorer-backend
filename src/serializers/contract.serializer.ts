import { Exclude } from 'class-transformer';

import { IContractSerializer } from '../interfaces/contract.interfaces';

export class ContractSerializer implements IContractSerializer<ContractSerializer> {
	@Exclude()
	_id: string;
	name: string;
	description: string;
	icon: string;
	code: string;
	abi: string;
	compiler_version: string;
	verified: boolean;
	users_has_liked: string[];

	@Exclude()
  	__v: number;

	@Exclude()
  	createdAt: object;

	@Exclude()
  	updatedAt: object;

	getInstance(partial: Partial<ContractSerializer>) {
		return Object.assign(this, partial);
	}

}
