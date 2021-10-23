import { Client, Message } from "discord.js";
import { DISCORD_EVENTS } from '../enums/events';
import { MESSAGE } from '../enums/message';
import { ENDPOINTS } from '../enums/endpoints';
import { NWStatusResponse } from '../interfaces/nwStatusWorldsResponse';
import { WorldInfo } from "../interfaces/world";

// Load the .env file from the root directory.
require('dotenv').config({ path: '../.env' });
class NWQueueBot {
	private discord = require('discord.js');
	private client: Client = new this.discord.Client();
	private axios = require('axios');
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
			// Early return which will prevent the bot from replying to himself.
			if (msg.author.id in [this.client.user?.id]) return;
			// Check whether the user has specified a world name.
			// If not, check the current queue status for 'inferni'.
			if (msg.content.includes(MESSAGE.QUEUE)) {
				const serverName = msg.content.split(' ').length > 1
					? msg.content.split(' ')[1]
					: 'inferni';
				const serverInfo: string = JSON.stringify(await this.getWorld(serverName.toLocaleLowerCase()));
				msg.reply(serverInfo);
			}
		});
	}
	/**
	 * Get information about a specific world.
	 * @param worldName
	 * @returns NWStatusResponse
	 */
	private async getWorld(worldName: string): Promise<string> {
		return await this.axios.get(`${ENDPOINTS.NEW_WORLD_STATUS}/${worldName}`, this.config)
			.then((res: NWStatusResponse) => {
				const response: WorldInfo = res.data.message;
				const worldNameCapitalized: string = this.capitalizeName(worldName);
				return response.players_current < response.players_maximum
					? `${worldNameCapitalized} has ${response.players_current} active players out of ${response.players_maximum}.`
					: `${worldNameCapitalized} is currently FULL with ${response.queue_current} players waiting. Current waiting time is ${response.queue_wait_time_minutes} minutes.`
			})
			.catch((err: any) => {
				console.error(err.response.statusText);
				return `Server ${worldName} not found!`
			})
	}

	/**
	 * Capitalize a World Name.
	 * @param name
	 * @returns
	 */
	private capitalizeName(name: string): string {
		return name.charAt(0).toUpperCase() + name.slice(1, name.length);
	}
}

new NWQueueBot();
