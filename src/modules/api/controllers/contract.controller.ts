import {
	Controller,
	Get,
	Body,
	Param,
	UsePipes,
	Post,
	Inject, UseInterceptors,
} from '@nestjs/common';

import { ContractValidator } from '../validators/contract.validator';
import { setValidationPipe } from '../validation.pipe';

import { IContractSerializer } from '../../../interfaces/contract.interfaces';
import { ContractService } from '../../../services/contract.service';
import { LikedContractDto } from '../dtos/contract.dtos';
import { ContractSerializer } from '../../../serializers/contract.serializer';
import { VerifySignatureInterceptor } from '../verify.signature.interceptor';

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

	@Post('like')
	@UsePipes(setValidationPipe(ContractValidator.likedContractSchema()))
	@UseInterceptors(VerifySignatureInterceptor)
	async likeContract(@Body() likedContract: LikedContractDto) {
		const contract = await this.contractService.likeContract(likedContract);
		return this.contractSerializer.getInstance(contract);
	}

	@Get(':id')
	@UsePipes(setValidationPipe(ContractValidator.contractIdSchema()))
	async getOneContract(@Param('id') id): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.getOneContact(id);
		return this.contractSerializer.getInstance(contract);
	}

}
