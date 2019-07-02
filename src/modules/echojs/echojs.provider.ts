import echo from 'echojs-lib';

import { TOKEN_ECHOJS } from '../../constants/global.constans';

export const getEchojsProvider = (url) => {
	return {
		provide: TOKEN_ECHOJS,
		useFactory: async () => {
			await echo.connect(url);
			return echo;
		},
	};
};
