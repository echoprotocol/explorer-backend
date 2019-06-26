import {
	Controller,
	Get, Post,
	Req, Body, Param,
	UsePipes,
	Inject,
} from '@nestjs/common';

import { ContractValidator } from '../validators/contract.validator';
import { setValidationPipe } from '../validation.pipe';

import { IContractModel, IContractSerializer } from '../../../interfaces/contract.interfaces';

import { ContractService } from '../../../services/contract.service';

import { ContractSerializer } from '../../../serializers/contract.serializer';

@Controller('contracts')
export class ContractController {

	constructor(
		private readonly contractService: ContractService,
		@Inject('IContractSerializer') private contractSerializer: IContractSerializer<ContractSerializer>,
	) {}

	@Post('abi')
	@UsePipes(setValidationPipe({
		id: ContractValidator.contractIdSchema(),
		abi: ContractValidator.contractAbiSchema(),
	}))
	async setContractAbi(@Body() { id, abi }): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.setContractAbi(id, abi);
		return this.contractSerializer.getInstance(contract);
	}

	@Get(':id')
	@UsePipes(setValidationPipe(ContractValidator.contractIdSchema()))
	async getOneContract(@Param('id') id): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.getOneContact(id);
		return this.contractSerializer.getInstance(contract);
	}

}
