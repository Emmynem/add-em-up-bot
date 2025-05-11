import { sessions } from "../../session.json";
import { MyContext, MockSession, User } from "./interfaces";

const defaultTimer: number = 300;
const waitHours: number = 1;

// Strip User Input, make it clean
function stripInput(text: string): string {
	return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "");
}

// Escape MarkdownV2 Text Automatically
function escapeMarkdownV2(text: string): string {
	// return text.replace(/[_[\]()~`>#+\-=|{}.!]/g, "\\$&");
	return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&"); // Main one
	// return text.replace(/[.]+/g, "\\$&");
}

function escapeMarkdownV2Alt(text: string): string {
	return text.replace(/[_[\]()~>#+\-=|{}.!]/g, "\\$&");
	// return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&"); // Main one
}

function stripUsername(text: string): string {
	return text.toLocaleLowerCase().trim().replace(/[@]/g, "");
}

function countFilter(value: number): string {
	if (isNaN(value))
		value = 0;

	if (value < 1000)
		return value + '';

	value /= 1000;

	if (value < 1000)
		return value.toFixed(1) + 'K';

	value /= 1000;

	if (value < 1000)
		return value.toFixed(1) + 'M';

	value /= 1000;

	if (value < 1000)
		return value.toFixed(1) + 'B';

	value /= 1000;

	return value.toFixed(1) + 'T';
};

function timestamp_str(): string {
	const d = new Date();
	const date_ = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	const time_ = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ":" + (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
	return date_ + " " + time_;
};

function isDifferenceGreaterThanHours(parsedDate: string, hours: number): boolean {
	if (!Number.isInteger(hours) || hours < 0) {
		throw new Error("Hours must be a non-negative integer.");
	}

	const currentDate = new Date();
	const inputDate = new Date(parsedDate);

	if (isNaN(inputDate.getTime())) {
		throw new Error("Invalid date format. Use 'YYYY-MM-DD hh:mm'.");
	}

	const differenceInMilliseconds = Math.abs(currentDate.getTime() - inputDate.getTime());
	const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

	return differenceInHours > hours;
}

function returnHoursToDate(parsedDate: string, hours: number): { date: string; time: string } {
	if (!Number.isInteger(hours) || hours < 0) {
		throw new Error("Hours must be a non-negative integer.");
	}

	const inputDate = new Date(parsedDate);

	if (isNaN(inputDate.getTime())) {
		throw new Error("Invalid date format. Use 'YYYY-MM-DD hh:mm'.");
	}

	inputDate.setHours(inputDate.getHours() + hours);

	const date = inputDate.getFullYear() + "-" +
		((inputDate.getMonth() + 1) < 10 ? "0" + (inputDate.getMonth() + 1) : (inputDate.getMonth() + 1)) + "-" +
		(inputDate.getDate() < 10 ? "0" + inputDate.getDate() : inputDate.getDate());

	const _hours = inputDate.getHours();
	const period = _hours >= 12 ? "PM" : "AM";
	const formattedHours = _hours % 12 === 0 ? 12 : _hours % 12;

	const time = (formattedHours < 10 ? "0" + formattedHours : formattedHours) + ":" +
		(inputDate.getMinutes() < 10 ? "0" + inputDate.getMinutes() : inputDate.getMinutes()) + ":" +
		(inputDate.getSeconds() < 10 ? "0" + inputDate.getSeconds() : inputDate.getSeconds()) + " " + period;

	return { date, time };
}

function getSession(ctx: MyContext): User | undefined {
	let currentSession: Array<MockSession> = sessions;

	const userId = ctx.from?.id;
	const chatId = ctx.chat?.id;

	// Check if user already exists
	const existingSession = currentSession.find((session) =>
		session.data.chatId === userId ||
		session.data.chatId === chatId ||
		session.data.fromId === userId ||
		session.data.fromId === chatId ||
		session.id === `${userId}:${userId}` ||
		session.id === `${chatId}:${chatId}`
	);

	if (existingSession && existingSession.data.user) {
		return existingSession.data.user; // Return found session
	}

	return ctx.session ? ctx.session.user : undefined; // Return newly created session
}

export { 
	defaultTimer, waitHours, stripInput, escapeMarkdownV2, escapeMarkdownV2Alt, stripUsername, countFilter, getSession, 
	isDifferenceGreaterThanHours, timestamp_str, returnHoursToDate
};