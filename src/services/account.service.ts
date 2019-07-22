import { Injectable } from '@nestjs/common';
import { svgAvatar } from 'echojs-ping';
import { Readable } from 'stream';

require('xmldom');

const window = require('svgdom');
const canvg = require('canvg');
const { createCanvas } = require('canvas');

import { AVATAR_SIZE } from '../constants/global.constans';

@Injectable()
export class AccountService {

	getReadableStream(buffer: Buffer): Readable {
		const stream = new Readable();
		stream.push(buffer);
		stream.push(null);
		return stream;
	}

	getAccountAvatar(name: string) {
		const svg = svgAvatar(name, AVATAR_SIZE, window);
		const canvas = createCanvas(AVATAR_SIZE, AVATAR_SIZE);
		canvg(canvas, svg);
		return canvas.toBuffer('image/png');
	}
}
