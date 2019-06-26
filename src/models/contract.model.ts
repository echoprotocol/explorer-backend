import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

const contractSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	name: { type: String },
	description: { type: String },
	icon: { type: String },
	code: { type: String },
	abi: { type: Array },
	compiler_version: { type: String },
	verified: { type: Boolean, default: false },
}, {
	timestamps: true,
});

export default MongooseModule.forFeature([{ name: 'Contract', schema: contractSchema }]);
