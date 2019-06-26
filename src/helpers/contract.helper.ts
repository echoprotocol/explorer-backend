import { Injectable } from '@nestjs/common';
import { keccak256 } from 'js-sha3';

@Injectable()
export class ContractHelper {

	getMethodCode(name = '', inputs = []) {
		return keccak256(`${name}(${inputs.map(({ type }) => type).join(',')})`).substr(0, 8);
	}

}
