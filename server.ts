import bot from "./src/bot";
import dotenv from 'dotenv';
dotenv.config();

const { WEBHOOK_DOMAIN, WEBHOOK_DOMAIN_TEST } = process.env;

const NODE_ENV: string = process.env.NODE_ENV || "development";
const PORT: number = NODE_ENV === "development" ? 863 : 88;

const webhookDomain = (NODE_ENV === "development" ? WEBHOOK_DOMAIN_TEST : WEBHOOK_DOMAIN) || "";

bot.telegram.getMe().then((botInfo) => {
	console.log(`🤖 Bot ${botInfo.username} is running...`);
}).catch((err) => {
	console.error("❌ Bot connection error:", err);
});

// Start bot
bot.launch({ webhook: { domain: webhookDomain, port: PORT, maxConnections: 100 } }).then(() => { 
	console.log("🤖 Bot is now using long polling...");
	console.log("Webhook bot listening on port", PORT);
});
