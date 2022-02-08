const { Telegraf } = require("telegraf")
const bot = new Telegraf("5209490378:AAHJqn2dXIuLttJmBIyL_GocDmdRp0x1kRU")
const axios = require("axios")

// const PROXY6_API_KEY = "3843269ba8-e247985298-f56e06e161"

const COUNTRY_CODE = "ua"
const PROXY_VERSION = "4"
let PROXY6_API_KEY = ""
let desiredCount = 0
let checker

bot.start((ctx) => {
	ctx.reply("Привет. Я помогу тебе купить прокси. Для начала работы введи API ключ (можешь достать его тут: https://proxy6.net/user/developers) и сколько прокси нужно купить. Потом введи команду /watch.");
})

bot.hears(/.+-.+-.+/, (ctx) => {
	PROXY6_API_KEY = ctx.message.text;
	ctx.reply(`Твой API ключ "${PROXY6_API_KEY}" записан.`);
})

bot.hears(/\d/g, (ctx) => {
	desiredCount = ctx.message.text;
	ctx.reply(`ок, я куплю тебе ${desiredCount} прокси. Запускай команду /watch для слежки.`);
})

bot.command("watch", (ctx) => {
	if (!PROXY6_API_KEY) {
		ctx.reply("API ключ не задан!");

		return
	}

	if (!desiredCount) {
		ctx.reply("Количество прокси на покупку не задано!");

		return
	}

	ctx.reply(`Слежка включена 👀. На API ключ "${PROXY6_API_KEY}" я куплю ${desiredCount} прокси.`)

	checker = setInterval(async () => {
		const availableProxy = await axios.get(`https://proxy6.net/api/${PROXY6_API_KEY}/getcount?country=${COUNTRY_CODE}&version=${PROXY_VERSION}`)

		if (availableProxy.data.count) {
			let quantityToBuy

			if (desiredCount > availableProxy.data.count) {
				quantityToBuy = availableProxy.data.count
				desiredCount = desiredCount - availableProxy.data.count
			} else if (desiredCount === availableProxy.data.count) {
				quantityToBuy = availableProxy.data.count
				desiredCount = 0
			} else {
				quantityToBuy = desiredCount
				desiredCount = 0
			}

			const buyRequest = await axios.get(`https://proxy6.net/api/${PROXY6_API_KEY}/buy?count=${quantityToBuy}&period=30&country=${COUNTRY_CODE}&version=${PROXY_VERSION}`)

			if (buyRequest.data.status === "yes") {
				if (desiredCount) {
					ctx.reply(`Ура! Я купил тебе ${quantityToBuy} прокси. Осталось купить ${desiredCount}. Можешь чекнуть в своем личном кабинете https://proxy6.net/user/proxy.`)
					ctx.reply(`Баланс: ${buyRequest.data.balance}`)
				} else {
					ctx.reply(`Ура! Я купил тебе ${quantityToBuy} прокси. Можешь чекнуть в своем личном кабинете https://proxy6.net/user/proxy.`)
					ctx.reply(`Баланс: ${buyRequest.data.balance}`)
					ctx.reply("Слежка остановлена. Обращайся если будет нужна помощь 😉")

					clearInterval(checker)
				}
			}
		}
	}, 10_000)
})

bot.command("log", (ctx) => {
	ctx.reply(`API ключ: ${PROXY6_API_KEY}`);
	ctx.reply(`Необходимо еще купить: ${desiredCount}`);
})

bot.command("stop", (ctx) => {
	ctx.reply("Слежка остановлена. Обращайся если будет нужна помощь 😉")
	clearInterval(checker)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
