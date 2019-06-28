import { DynamicModule } from '@nestjs/common';
import { getEchojsProvider } from './echojs.provider';
import { TOKEN_ECHOJS } from '../../constants/global.constans';

export class EchojsModule {
	static forRoot(url: string): DynamicModule {

		return {
			module: EchojsModule,
			providers: [getEchojsProvider(url)],
			exports: [TOKEN_ECHOJS],
		};
	}
}
