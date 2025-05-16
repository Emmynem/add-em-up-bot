import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";

const settings = async (ctx: MyContext) => {
	
	return ctx.reply(
		"*Settings*\n\n"
		+ "*GENERAL SETTINGS*\n"
		+ "*Group ID:* Currently set group id or username to add members to\\. Tap to edit\\.\n",
		{
			...Markup.inlineKeyboard([
				[Markup.button.callback('--- General Settings ---', 'DASHES')],
				[Markup.button.callback(`✏️ Group ID: ${ctx.session.user?.group_id ? ctx.session.user?.group_id : "None"}`, 'SETTINGS_GROUP_ID_VALUE')],
				[Markup.button.callback('Close', 'CLOSE')],
			]),
			parse_mode: "MarkdownV2"
		}
	);
};

export default settings;
