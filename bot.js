const { Telegraf } = require('telegraf')
const bot = new Telegraf("5209490378:AAHJqn2dXIuLttJmBIyL_GocDmdRp0x1kRU")
const PROXY6_API_KEY = "3843269ba8-e247985298-f56e06e161"
const axios = require("axios")

// https://proxy6.net/api/{api_key}/{method}/?{params}
// https://proxy6.net/api/${PROXY6_API_KEY}/getcount?country=ru&version=4

bot.start((ctx) => {
	ctx.reply("Слежка включена 👀")
	ctx.reply("Как только прокси будут доступны для покупки - я тебе скажу.")

	setInterval(async () => {
		const availableProxys = await axios.get(`https://proxy6.net/api/${PROXY6_API_KEY}/getcount?country=ua&version=4`)

		if (availableProxys.data.count) {
			ctx.reply("Ура! Прокси в наличии! Быстрей заходи на https://proxy6.net/order чтобы купить.")
			ctx.reply(`Количество доступных для покупки прокси: ${availableProxys.data.count}`)
		}
	}, 30000)
})



// bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
// bot.on('sticker', (ctx) => ctx.reply('')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
// bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"





















bot.launch()

