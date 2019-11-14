declare module 'config' {
	export const dbUrl: string;
	export const env: 'development' | 'production';
	export const cors: boolean;
	export const traceApiRequests: boolean;
	export const port: number;
	export const sessionSecret: string;
	export const solcListUrl: string;
	export const solcBinUrl: string;
	export const url: string;
	export const logger: {
		level: string;
	};
	export const raven: {
		enabled: boolean;
		config: string;
	};
	export const echodb: {
		http_url: string;
	};
}
