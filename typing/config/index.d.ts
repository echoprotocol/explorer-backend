declare module 'config' {
	export const env: 'development' | 'production';
	export const cors: boolean;
	export const traceApiRequests: boolean;
	export const port: number;
	export const sessionSecret: string;
	export const logger: {
		level: string;
	};
	export const raven: {
		enabled: boolean;
		config: string;
	};
}
