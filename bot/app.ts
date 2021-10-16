import { Client, Message } from "discord.js";
import { DISCORD_EVENTS } from '../enums/events';
import { MESSAGE } from '../enums/message';
import { ENDPOINTS } from '../enums/endpoints';
import { NWStatusResponse } from '../interfaces/nwStatusWorldsResponse';

// Load the .env file from the root directory.
require('dotenv').config({ path: '../.env' });
class NWQueueBot {
	public axios = require('axios');
	public discord = require('discord.js');
	public client: Client = new this.discord.Client();

	private config = {
		headers: {
			'Authorization': `Bearer ${process.env.NW_BEARER}`
		},

	}

	constructor() {
		this.client.login(process.env.TOKEN);
		this.client.on(DISCORD_EVENTS.READY, () => {
			console.log(`Logged in as ${this.client.user!.tag}`);
		})

		this.client.on(DISCORD_EVENTS.MESSAGE, async (msg: Message) => {
			switch (msg.content) {
				case 'ping':
					msg.reply('pong');
					break;
				case MESSAGE.QUEUE:
					const serverInfo: string = JSON.stringify(await this.getWorld('Inferni'));
					msg.reply(serverInfo);
					break;
			};
		});
	}
	/**
	 * Get information about a specific world.
	 * @returns NWStatusResponse
	 */
	private async getWorld(worldName: string): Promise<NWStatusResponse | undefined> {
		return await this.axios.get(`${ENDPOINTS.NEW_WORLD_STATUS}?identifier=${worldName}`, this.config)
			.then((res: NWStatusResponse) => {
				return res.data.message.worlds.filter((world: any) => {
					return world.name === worldName
				});
			})
			.catch((err: any) => {
				console.error(err);
			})
	}
}

new NWQueueBot();
