import {
	Controller,
	Put,
	Get, Body,
	Param,
	UsePipes,
	Post,
	Inject, UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ContractValidator } from '../validators/contract.validator';
import { setValidationPipe } from '../validation.pipe';
import { IContractSerializer } from '../../../interfaces/contract.interfaces';
import { ContractService } from '../../../services/contract.service';
import { VerifyContractOwnerInterceptor } from '../verify.contract.owner.interceptor';
import { LikedContractDto } from '../dtos/contract.dtos';
import { ContractSerializer } from '../../../serializers/contract.serializer';
import { VerifySignatureInterceptor } from '../verify.signature.interceptor';
import { MulterService } from '../../../services/multer.service';

@Controller('contracts')
export class ContractController {

	constructor(
		private readonly contractService: ContractService,
		@Inject('IContractSerializer') private contractSerializer: IContractSerializer<ContractSerializer>,
	) {}

	@Post('abi')
	@UsePipes(setValidationPipe({
		body: {
			id: ContractValidator.contractIdSchema(),
			abi: ContractValidator.contractAbiSchema(),
		},
	}))
	async setContractAbi(@Body() { id, abi }): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.setContractAbi(id, abi);
		return this.contractSerializer.getInstance(contract);
	}

	@Put(':id')
	@UsePipes(setValidationPipe({
		param: ContractValidator.contractIdSchema(),
		body: ContractValidator.updateContractSchema(),
	}))
	@UseInterceptors(VerifySignatureInterceptor, VerifyContractOwnerInterceptor)
	@UseInterceptors(FileInterceptor('icon', MulterService.getOptions()))
	async updateContract(
		@UploadedFile() file,
		@Param('id') id: string,
		@Body() contractInfo: Object,
	): Promise<IContractSerializer<ContractSerializer>>  {
		const contract = await this.contractService.updateContract(id, file, contractInfo);
		return this.contractSerializer.getInstance(contract);
	}

	@Post('like')
	@UsePipes(setValidationPipe({
		body: ContractValidator.likedContractSchema(),
	}))
	@UseInterceptors(VerifySignatureInterceptor)
	async likeContract(@Body() likedContract: LikedContractDto) {
		const contract = await this.contractService.likeContract(likedContract);
		return this.contractSerializer.getInstance(contract);
	}

	@Get(':id')
	@UsePipes(setValidationPipe({
		param: ContractValidator.contractIdSchema(),
	}))
	async getOneContract(@Param('id') id): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.getOneContact(id);
		return this.contractSerializer.getInstance(contract);
	}

}
