# add-em-up-bot-ts

This is a bot to add users to groups automatically using Node.js, TypeScript and Telegraf.

---

## 📦 Requirements

- Telegram App credentials | Get your `API_ID` and `API_HASH` from [https://my.telegram.org](https://my.telegram.org).
- String Session | Go to [this repo](https://github.com/Emmynem/telegram-session-generator), follow the instructions in the README.md to generate one.

---

### Create a `.env` File

Create a `.env` file in the root of the project with the following:

```env
API_ID=your_telegram_api_id
API_HASH=your_telegram_api_hash=

DATABASE=your_database
DATABASE_ONLINE=online_database
DB_HOST=your_host
DB_HOST_ONLINE=online_host
DB_USER=your_database_user
DB_USER_ONLINE=online_database_user
DB_PASSWORD=your_database_password
DB_PASSWORD_ONLINE=online_database_password

BOT_TOKEN_TEST=your_test_bot_token
BOT_TOKEN=your_live_bot_token

WEBHOOK_DOMAIN_TEST=your_test_webhook_domain
WEBHOOK_DOMAIN=your_live_webhook_domain

API_ID=your_api_id
API_HASH=your_api_hash
TG_PHONE_NUMBER=your_telegram_phone_number
STRING_SESSION=your_string_session
```

## 🚀 Run

Run the script to start your Telegram `Bot`:

For Dev
```bash
npm run watch:dev
```

For Live

Build the scripts and upload to your server using
```bash
npm run build
```

Then your start up file should be
```
server.js
```