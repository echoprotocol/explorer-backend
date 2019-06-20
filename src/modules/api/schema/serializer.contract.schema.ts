import { Exclude } from 'class-transformer';
import { ISerializerContract } from '../../../interfaces/serializer.contract.interface';

export class ContractEntity implements ISerializerContract<ContractEntity> {
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

	getInstance(partial: Partial<ContractEntity>) {
		return Object.assign(this, partial);
	}

}
