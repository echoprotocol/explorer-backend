declare namespace Express {
	export interface Request {
		query: { [key: string]: string; };
		params: { [key: string]: string; };
		body: { [key: string]: string; };
		form: { [key: string]: string; };
	}
}
