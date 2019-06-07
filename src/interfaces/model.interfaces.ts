import { Document } from 'mongoose';

export interface Contract extends Document {
	readonly name: string;
}
