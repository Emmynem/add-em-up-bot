import { MyContext } from "../../config/interfaces";

const groupId = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	ctx.session.waitingResponse = true;
	ctx.session.waitingAction = "ENTER_GROUP_ID_VALUE";

	ctx.session.currentSettingsMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`💬 Reply with the new group id or username`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default groupId;