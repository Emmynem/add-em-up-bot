import { MyContext } from "../../config/interfaces";

const dashes = async (ctx: MyContext) => {
	return await ctx.answerCbQuery(); // Remove loading animation
};

export default dashes;