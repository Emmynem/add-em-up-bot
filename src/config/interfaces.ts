import { Context, Telegram } from 'telegraf';

export interface User {
	id?: number;
	group_id?: string | null;
	last_checked?: string;
}


// Define session interface
interface MySession {
	username?: string;
	name?: string;
	chatId?: number;
	fromId?: number;
	user?: User;
	waitingResponse?: boolean;
	signedIn?: boolean;
	waitingAction?: string;
	promptMessageId?: number;
	currentSettingsMessageId?: number;
}

// Extend Telegraf Context to include our custom session
export interface MyContext extends Context {
	session: MySession;
	startPayload?: string;
}

export interface MockSession {
	id: string;
	data: MySession;
}