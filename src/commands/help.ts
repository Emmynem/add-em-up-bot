import { MyContext } from "../config/interfaces";

const help = async (ctx: MyContext) => {

	return ctx.reply(
		"*🤖 AddEmUpBot Help Guide*\n\n"
		+ "This bot allows you to add multiple Telegram users to a group with just a few commands — efficiently and securely\\.\n\n"

		+ "📌 * What You Can Do:*\n"
		+ "• Add up to 30 Telegram user IDs at once\\.\n"
		+ "• Skip users who are already in the group or already added before\\.\n"
		+ "• Automatically respect Telegram's rate limits\\.\n\n"

		+ "🔹 *How to Use:*\n"
		+ "1\\. Use /settings to set your *target group ID* \\(you must be an admin there, and so should the bot\\)\\.\n"
		+ "2\\. Once your group is set, simply paste a space\\-separated list of Telegram user IDs\\.\n"
		+ "_ Example:_ `123456789 987654321 111222333` or `username1 username2 username3`\n"
		+ "or\n"
		+ "_Example:_ `123456789,987654321,111222333` or `username1,username2,username3`\n\n"

		+ "✅ The bot will verify permissions, add eligible users, and skip duplicates or restricted accounts\\.\n\n"
		
		+ "*🔹 Available Commands:*\n"
		+ "/start – Introduction and usage\n"
		+ "/settings – Set or update your target group\n"
		+ "/help – Show this help message\n\n"

		// + "_Ensure this bot is an admin in the group with permission to invite users_\n\n"

		+ "Let’s get adding\\! 🚀",
		{ parse_mode: "MarkdownV2" }
	);

};

export default help;
