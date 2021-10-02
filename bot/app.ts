import { Client, Message } from "discord.js";
import { DISCORD_EVENTS } from '../enums/events';

// Load the .env file from the root directory.
require('dotenv').config({path: '../.env'});

const discord = require('discord.js');
const client: Client = new discord.Client();

client.on(DISCORD_EVENTS.READY, () => {
	console.log(`Logged in as ${client.user!.tag}`);
})

client.on(DISCORD_EVENTS.MESSAGE, (msg: Message) => {
	if (msg.content === 'ping') {
		msg.reply('pong')
	}
})

client.login(process.env.TOKEN);
