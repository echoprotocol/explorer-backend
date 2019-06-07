import { Controller, Get, Req } from '@nestjs/common';

import { Contract } from '../../../interfaces/model.interfaces';

import { ContractService } from '../../../services/contract.service';

@Controller('contract')
export class ContractController {

	constructor(private readonly contractService: ContractService) {}

	@Get('all')
	getContracts(@Req() { form }): Promise<Contract[]> {
		return this.contractService.getContracts(form);
	}
}
