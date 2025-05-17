import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";
import { escapeMarkdownV2, getSession, isDifferenceGreaterThanHours, returnHoursToDate, waitHours } from "../config";

const start = async (ctx: MyContext) => {

	const startPayload = ctx.startPayload;

	if (!getSession(ctx)) {
		ctx.session = {
			chatId: ctx.chat?.id, // Store user's chat ID
			fromId: ctx.from?.id,   // Store user's from ID
			username: ctx.from?.username,   // Store user's from Username
			name: ctx.from?.first_name,
			user: {
				id: ctx.chat?.id || ctx.from?.id, 
				group_id: null
			}
		}
	}

	ctx.reply(
		`Welcome to AddEmUpBot 🤖\n\n`
		+ `This bot helps you quickly add multiple Telegram users to a predefined group, smart, secure, and efficient\\.\n\n`
		+ "✅ Paste up to 30 Telegram user IDs\n"
		+ "✅ Automatically skips users already added\n"
		+ "✅ Respects Telegram rate limits\n"
		+ "✅ Verifies group access and bot permissions before proceeding\n\n"
		+ "Click on *Add Members* to start\n",
		{
			...Markup.inlineKeyboard([
				[Markup.button.callback(`${ctx.session.user?.last_checked && isDifferenceGreaterThanHours(ctx.session.user?.last_checked, waitHours) ? "➕ Add Members" : `🔒 Locked till ${ctx.session.user?.last_checked ? returnHoursToDate(ctx.session.user?.last_checked, waitHours).time : "No date"}`}`, `${ctx.session.user?.last_checked && isDifferenceGreaterThanHours(ctx.session.user?.last_checked, waitHours) ? "INITIATE": "DASHES"}`), Markup.button.callback('⚙️ Settings', 'SETTINGS')],
			]),
			parse_mode: "MarkdownV2"
		}
	);

};

export default start;