import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { MyContext } from "./config/interfaces";
import sequelize from './config/database';

// Import Commands
import start from "./commands/start";
import help from "./commands/help";
import settings from "./commands/settings";

// End - Import Commands

// Import Actions
import hears from "./actions/hears";
import initiate from "./actions/initiate";

// Defaults
import dashes from "./actions/defaults/dashes";
import close from "./actions/defaults/close";

// Settings
import groupId from "./actions/settings/groupId";
// End - Import Actions

import dotenv from 'dotenv';
dotenv.config();

const { BOT_TOKEN, BOT_TOKEN_TEST } = process.env;

const NODE_ENV: string = process.env.NODE_ENV || "development";

const bot = new Telegraf<MyContext>((NODE_ENV === "development" ? BOT_TOKEN_TEST : BOT_TOKEN) || "");
sequelize.sync().then(() => console.log("✅ Database synced"));

// Commands Regex
const startRegExp = /^(start)$/i;
const helpRegExp = /^(help)$/i;
const settingsRegExp = /^(settings)$/i;

// Actions Regex
const closeRegExp = /^(CLOSE)$/i;
const dashesRegExp = /^(DASHES)$/i;
const initiateRegExp = /^(INITIATE)$/i;

// - Settings
const groupIdRegExp = /^(SETTINGS_GROUP_ID_VALUE)$/i;

// Use session middleware (Local Storage)
bot.use((new LocalSession({ database: 'session.json' })).middleware());

(async () => {
	const existingCommands = await bot.telegram.getMyCommands();

	if (existingCommands.length === 0) {
		bot.telegram.setMyCommands([
			{
				command: "start",
				description: "Welcome to AddEmUpBot 🤖, start adding."
			},
			{
				command: "settings",
				description: "Update preferences."
			},
			{
				command: "help",
				description: "🆘 Tips/FAQs/Help"
			},
		]);
		console.log("Commands set successfully.");
	} else {
		console.log("Commands already exist, skipping setup.");
	}
})();

// Commands
bot.start(start);

bot.hears(startRegExp, start);
bot.command(startRegExp, start);
bot.action(startRegExp, start);

bot.hears(helpRegExp, help);
bot.command(helpRegExp, help);
bot.action(helpRegExp, help);

bot.hears(settingsRegExp, settings);
bot.command(settingsRegExp, settings);
bot.action(settingsRegExp, settings);

// End - Commands

// Actions 
bot.action(closeRegExp, close);
bot.action(dashesRegExp, dashes);
bot.action(groupIdRegExp, groupId);
bot.action(initiateRegExp, initiate);

// All Listening hears
bot.hears(/.*/, hears);

// End - Actions

export default bot;
