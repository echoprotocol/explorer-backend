import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Req,
	UseInterceptors,
	UsePipes,
} from '@nestjs/common';

import { Contract } from '../../../interfaces/model.interfaces';

import { ContractService } from '../../../services/contract.service';

import { ApiPipe } from '../api.pipe';
import { ContractIdSchema } from '../schema/joi.contract.schema';
import { ISerializerContract } from '../../../interfaces/serializer.contract.interface';
import { ContractEntity } from '../schema/serializer.contract.schema';

@Controller('contracts')
@UseInterceptors(ClassSerializerInterceptor)
export class ContractController {

	constructor(private readonly contractService: ContractService) {}

	@Get('all')
	getContracts(@Req() { form }): Promise<Contract[]> {
		return this.contractService.getContracts(form);
	}

	@Get(':id')
	@UsePipes(new ApiPipe(ContractIdSchema))
	getOneContract(@Param('id') id): Promise<ISerializerContract<ContractEntity>> {
		return this.contractService.getOneContact(id);
	}

}
