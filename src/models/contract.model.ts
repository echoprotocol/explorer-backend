import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

const contractSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	name: { type: String },
	description: { type: String },
	icon: { type: String },
	source_code: { type: String },
	abi: { type: Array },
	compiler_version: { type: String },
	verified: { type: Boolean, default: false },
	users_has_liked: { type: [String], default: [] },
}, {
	timestamps: true,
});

export default MongooseModule.forFeature([{ name: 'Contract', schema: contractSchema }]);
