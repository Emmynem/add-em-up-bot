import { TelegramClient, Api, errors } from "telegram";
import { StringSession } from "telegram/sessions";
import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";
import { timestamp_str, escapeMarkdownV2, defaultTimer } from "../config";
import { Users } from "../models/users";
import { Session } from "../models/session";
import dotenv from 'dotenv';
import settings from "../commands/settings";
dotenv.config();

const { API_ID, API_HASH, TG_PHONE_NUMBER, STRING_SESSION } = process.env;

const hears = async (ctx: MyContext) => {

	try {
		// Write listeners below

		// Initiate listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z0-9]+/gi) && ctx.session.waitingAction === "ENTER_TELEGRAM_IDS" || (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z0-9]+/gi) && 'reply_to_message' in ctx.message && ctx.message.reply_to_message?.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay

			// Optimized version of the Telegram user-invite handler
			const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

			const userMessageId = ctx.message.message_id;
			const idsMessage = ctx.message.text.trim();
			const ids = idsMessage.split(/[\s,]+/gi).filter((id, index, self) => id.trim() !== "" && self.indexOf(id) === index); // Split by whitespace or commas, remove duplicates and empty entries

			if (!ctx.session.user?.group_id) {
				await ctx.reply(`_Group ID not found_\n\nGo to /settings to add\.`, { parse_mode: "MarkdownV2" });
				return;
			}
			if (!ids.length) {
				await ctx.reply("Please provide Telegram user IDs separated by spaces.");
				return;
			}
			if (!API_HASH || !API_ID || !TG_PHONE_NUMBER || !STRING_SESSION) {
				await ctx.reply("❌ Api configs are unavailable");
				return;
			}

			const apiId = parseInt(API_ID);
			const apiHash = API_HASH;
			const stringSession = new StringSession(STRING_SESSION);
			const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });

			await client.start({
				phoneNumber: TG_PHONE_NUMBER,
				password: async () => "",
				phoneCode: async () => "",
				onError: (err) => console.log(err),
			});

			const group = await client.getEntity(ctx.session.user.group_id);
			await ctx.reply("🔃 Processing IDs ...\n\nWill reply once done.");

			let addedIds = [];
			let failedIds = [];
			const telegramId = ctx.session.chatId || ctx.session.fromId;

			// Resolve all user entities concurrently, respecting rate limits
			const entityPromises = ids.map((id) => client.getEntity(id).catch((err) => ({ error: err, id })));
			const userEntities = await Promise.all(entityPromises);

			for (const user of userEntities) {
				const id = user?.id || user?.id?.toString() || user.id;

				// const [record] = await Users.findOrCreate({
				// 	where: {
				// 		user_telegram_id: telegramId,
				// 		telegram_id: id.toString(),
				// 		group_id: ctx.session.user.group_id,
				// 	},
				// });

				// Skip if the user entity contains an error
				if ('error' in user) {
					console.error(`Failed to get entity for ${user.id}:`, user.error);
					failedIds.push(user.id);
					// await Users.update(
					// 	{ status: "failed" },
					// 	{
					// 		where: {
					// 			user_telegram_id: telegramId,
					// 			telegram_id: id.toString(),
					// 			group_id: ctx.session.user.group_id,
					// 		},
					// 	}
					// );
					continue;
				}

				try {

					// if (record.status === "invited") {
					// 	failedIds.push(id);
					// 	continue;
					// }

					const invite = await client.invoke(
						new Api.channels.InviteToChannel({
							channel: group,
							users: [user],
						})
					);

					// console.log(invite)
					if (invite.missingInvitees.length < 1) {
						// await Users.update(
						// 	{ status: "invited" },
						// 	{
						// 		where: {
						// 			user_telegram_id: telegramId,
						// 			telegram_id: id,
						// 			group_id: ctx.session.user.group_id,
						// 		},
						// 	}
						// );

						addedIds.push(id);
					} else {
						failedIds.push(id);
					}
					await delay(6000); // 6s delay to prevent flood
				} catch (err) {
					console.error(`Failed to add user ${id}:`, err);

					const errMsg = (err as { errorMessage?: string; message?: string }).errorMessage || (err as { message?: string }).message;

					if (err instanceof errors.FloodWaitError) {
						await ctx.reply(`FLOOD_WAIT: waiting ${err.seconds} seconds`);
						await delay((err.seconds + 5) * 1000);
						break; // Stop processing on flood
					}

					if (errMsg && errMsg.includes("USER_CHANNELS_TOO_MUCH")) {
						await ctx.reply(`❌ User ${id} has joined too many channels. Skipping.`);
					} else if (errMsg && errMsg.includes("PEER_FLOOD")) {
						await ctx.reply(`🚫 Telegram flagged this as spam (PEER_FLOOD). User: ${id}`);
						break;
					} else {
						await ctx.reply(`❌ Unknown error for user ${id}: ${errMsg}`);
					}

					failedIds.push(id);
					// await Users.update(
					// 	{ status: "failed" },
					// 	{
					// 		where: {
					// 			user_telegram_id: telegramId,
					// 			telegram_id: id.toString(),
					// 			group_id: ctx.session.user.group_id,
					// 		},
					// 	}
					// );
				}
			}

			const summary = `✅ Users added: ${addedIds.join(", ") || "None"} (Total: ${addedIds.length})\n\n⏭️ Skipped or failed: ${failedIds.join(", ") || "None"} (Total: ${failedIds.length})`;

			ctx.session.user.last_checked = timestamp_str();
			await ctx.reply(summary);
			await ctx.deleteMessage(ctx.session.promptMessageId).catch(console.log);
			ctx.session.waitingResponse = false;
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;

			// Optional cleanup
			// await client.disconnect(); // <--- Close Telegram connection

		}

		// Group ID Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.waitingAction === "ENTER_GROUP_ID_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			// if (replyValue.match(/[a-zA-Z]/gi)) {
			// 	await ctx.reply('Invalid Value');
			// 	setTimeout(() => {
			// 		ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
			// 	}, defaultTimer);
			// } else {
			// }
			ctx.session.waitingResponse = false;
			ctx.session.user.group_id = replyValue;
			setTimeout(async () => {
				// ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				// ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
				settings(ctx);
			}, defaultTimer);

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		return;
	} catch (err) {
		console.log(err)
		await ctx.reply(`_Unable to listen_`, { parse_mode: "MarkdownV2" });
	}
};

export default hears;