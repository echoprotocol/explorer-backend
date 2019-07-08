import {
	Controller,
	Get, Post, Put,
	Body, Param, UploadedFile,
	UsePipes, UseInterceptors,
	Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ContractValidator } from '../validators/contract.validator';
import { setValidationPipe } from '../validation.pipe';
import { IContractSerializer } from '../../../interfaces/contract.interfaces';
import { ContractService } from '../../../services/contract.service';
import { LikedContractDto, SetContractAbiDto, VerifyContractDto } from '../dtos/contract.dtos';
import { ContractSerializer } from '../../../serializers/contract.serializer';
import { VerifySignatureInterceptor } from '../verify.signature.interceptor';
import { VerifyContractOwnerInterceptor } from '../verify.contract.owner.interceptor';
import { MulterService } from '../../../services/multer.service';

@Controller('api/contracts')
export class ContractController {

	constructor(
		private readonly contractService: ContractService,
		@Inject('IContractSerializer') private contractSerializer: IContractSerializer<ContractSerializer>,
	) {}

	@Get(':id')
	@UsePipes(setValidationPipe({ param: ContractValidator.contractIdSchema() }))
	async getOneContract(@Param('id') id): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.getOneContact(id);
		return new ContractSerializer(contract);
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
		return new ContractSerializer(contract);
	}

	@Post('like')
	@UsePipes(setValidationPipe({
		body: ContractValidator.likedContractSchema(),
	}))
	@UseInterceptors(VerifySignatureInterceptor)
	async likeContract(@Body() likedContract: LikedContractDto) {
		const contract = await this.contractService.likeContract(likedContract);
		return new ContractSerializer(contract);
	}

	@Post('abi')
	@UsePipes(setValidationPipe({
		body: {
			id: ContractValidator.contractIdSchema(),
			abi: ContractValidator.contractAbiSchema(),
		},
	}))
	async setContractAbi(@Body() { id, abi }: SetContractAbiDto): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.setContractAbi(id, abi);
		return new ContractSerializer(contract);
	}

	@Post('verify')
	@UsePipes(setValidationPipe({
		body: {
			id: ContractValidator.contractIdSchema(),
			name: ContractValidator.string().required(),
			inputs: ContractValidator.contractInputsSchema(),
			compiler_version: ContractValidator.string().required(),
			source_code: ContractValidator.string().required(),
		},
	}))
	async verifyContract(@Body() {
		id, name, compiler_version, inputs, source_code,
	}: VerifyContractDto): Promise<IContractSerializer<ContractSerializer>> {
		const contract = await this.contractService.verifyContract(source_code, id, name, compiler_version, inputs);
		return new ContractSerializer(contract);
	}

}
