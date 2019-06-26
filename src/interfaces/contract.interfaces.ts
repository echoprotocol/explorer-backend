import { Document } from 'mongoose';

export interface IContractModel extends Document {
	readonly name: string;
}

export interface IContractSerializer<T> {
	_id: string;
	name: string;
	description: string;
	icon: string;
	code: string;
	abi: string;
	compiler_version: string;
	verified: boolean;
	users_has_liked: string[];
	__v: number;
	createdAt: object;
	updatedAt: object;

	getInstance(partial: Partial<T>): T;
}
