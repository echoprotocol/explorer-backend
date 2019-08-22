import { Exclude } from 'class-transformer';

import { IContractSerializer } from '../interfaces/contract.interfaces';

export class ContractSerializer implements IContractSerializer<ContractSerializer> {
	@Exclude()
	_id: string;
	id: string;
	name: string;
	description: string;
	icon: string;
	source_code: string;
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

	constructor(partial: Partial<ContractSerializer>) {

		if (partial) {
			this.id = partial._id;
		}

		Object.assign(this, partial);
	}

}
