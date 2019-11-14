import { Injectable } from '@nestjs/common';
import { keccak256 } from 'js-sha3';

@Injectable()
export class ContractHelper {

	getMethodCode(name = '', inputs = []) {
		return keccak256(`${name}(${inputs.map(({ type }) => type).join(',')})`).substr(0, 8);
	}

	processBytecode(version, bytecode) {
		const [, minor, patch] = version.split('.');

		console.log(' minor, patch ', minor, patch);

		if (minor >= 5 && patch >= 9) {
			const start = bytecode.lastIndexOf('6080604052');
			const end = bytecode.search('a265');
			return bytecode.slice(start, end);
		}

		if ((parseInt(minor, 10) === 4 && patch >= 22) || (parseInt(minor, 10) === 5 && patch <= 8)) {
			const start = bytecode.lastIndexOf('6080604052');
			const end = bytecode.search('a165627a7a72305820');
			return bytecode.slice(start, end);
		}

		if (minor >= 4 && patch >= 7) {
			const start = bytecode.lastIndexOf('6060604052');
			const end = bytecode.search('a165627a7a72305820');
			return bytecode.slice(start, end);
		}

		return bytecode;
	}

}
