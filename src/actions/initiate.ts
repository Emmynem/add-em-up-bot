import { MyContext } from "../config/interfaces";
import { isDifferenceGreaterThanHours, returnHoursToDate, waitHours } from "../config";

const initiate = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user?.last_checked && isDifferenceGreaterThanHours(ctx.session.user?.last_checked, waitHours)) {
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_TELEGRAM_IDS";
	
		const promptMessage = await ctx.reply(
			`Reply with all the telegram ids you want to add \\(max 20 \\- 30\\)\n\n` +
			+ "*To get started, send a space\\-separated or comma\\-separated list of user IDs*\\.\n"
			+ "_ Example:_ `123456789 987654321 111222333` or `username1 username2 username3`\n"
			+ "or\n"
			+ "_Example:_ `123456789,987654321,111222333` or `username1,username2,username3`\n",
			{
				parse_mode: "MarkdownV2"
			}
		);
	
		ctx.session.promptMessageId = promptMessage.message_id;
	} else {
		await ctx.reply(`🔒 Locked till ${ctx.session.user?.last_checked ? returnHoursToDate(ctx.session.user?.last_checked, waitHours).date + " " + returnHoursToDate(ctx.session.user?.last_checked, waitHours).time : "No date"}`)
	}
};

export default initiate;