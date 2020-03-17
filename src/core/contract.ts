export class Contract {
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

	constructor(data) {
	  this._id = data._id;
	  this.id = data.id;
	  this.name = data.name;
	  this.description = data.description;
	  this.icon = data.icon;
	  this.source_code = data.source_code;
	  this.abi = data.abi;
	  this.compiler_version = data.compiler_version;
	  this.verified = data.verified;
	  this.users_has_liked = data.users_has_liked;
	}
}
