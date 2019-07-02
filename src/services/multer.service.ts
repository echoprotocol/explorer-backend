import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

import { PATH_TO_ICONS, PATH_TO_PUBLIC } from '../constants/global.constans';

export class MulterService {

	static dest = `${process.env.PWD}/${PATH_TO_PUBLIC}/${PATH_TO_ICONS}`;

	static getOptions() {
		return (
			{
				fileFilter: (req: any, file: any, cb: any) => {
					if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
						cb(null, true);
					} else {
						cb(new BadRequestException(`Unsupported file type ${file.originalname}`));
					}
				},
				storage: diskStorage({
					destination: (req: any, file: any, cb: any) => {
						const uploadPath = MulterService.dest;
						cb(null, uploadPath);
					},
					filename: (req: any, file: any, cb: any) => {
						const [ext] = file.originalname.split('.').reverse();
						file['filename'] = `${req.params.id}.${ext}`;
						cb(null, file['filename']);
					},
				}),
			}
		);
	}

}
