import { MyContext } from "../../config/interfaces";
import { defaultTimer } from "../../config";

const close = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	setTimeout(() => {
		ctx.deleteMessage(ctx.message?.message_id).catch((err) => console.log('Error deleting user message:', err));
	}, defaultTimer);
};

export default close;