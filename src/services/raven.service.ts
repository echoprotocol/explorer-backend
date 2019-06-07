import { Logger } from '@nestjs/common';
import * as config from 'config';
import * as Raven from 'raven';
import { promisify } from 'util';
import AbstractInitableHelper from './abstract.initable.services';

export class RavenService extends AbstractInitableHelper {
	private installed = false;
	private logger = new Logger('raven.service');

	async init() {
		if (!config.raven.enabled) {
			this.logger.warn('Raven is disabled', 'raven.service');
		} else {
			await this.install();
		}
	}

	async install() {
		await promisify(Raven.config(config.raven.config).install)();
		this.installed = true;
	}

	uninstall() {
		Raven.uninstall();
		this.installed = false;
	}

	warning(message: string, additionalData = {}) {
		this.logger.warn(message);
		this.sendMessageToRaven(message, 'warning', additionalData);
	}

	message(message: string, additionalData = {}) {
		this.logger.log(message);
		this.sendMessageToRaven(message, 'info', additionalData);
	}

	error(error: Error, key: string, additionalData = {}) {
		if (!this.installed) return error;
		const extra = { ...additionalData, key };
		Raven.captureException(error, { extra });
	}

	private sendMessageToRaven(message: string, level: 'info' | 'warning', extra: {}) {
		if (!this.installed) return;
		Raven.captureMessage(message, { level, extra });
	}

}
