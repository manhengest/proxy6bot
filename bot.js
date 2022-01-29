const { Telegraf } = require('telegraf')
const bot = new Telegraf("5209490378:AAHJqn2dXIuLttJmBIyL_GocDmdRp0x1kRU")
const PROXY6_API_KEY = "3843269ba8-e247985298-f56e06e161"
const axios = require("axios")

const COUNTRY_CODE = "ua"

bot.start((ctx) => {
	ctx.reply("Слежка включена 👀")
	ctx.reply("Как только прокси будут доступны для покупки - я тебе скажу.")

	const checker = setInterval(async () => {
		const availableProxys = await axios.get(`https://proxy6.net/api/${PROXY6_API_KEY}/getcount?country=${COUNTRY_CODE}&version=4`)

		if (availableProxys.data.count) {
			success(availableProxys.data.count)
		}
	}, 30000)

	const success = (count) => {
		ctx.reply("Ура! Прокси в наличии! Быстрей заходи на https://proxy6.net/order чтобы купить.")
		ctx.reply(`Количество доступных для покупки прокси: ${count}`)
		ctx.reply("Слежка остановлена. Обращайся если будет нужна помощь 😉")

		clearInterval(checker)
	}
})



















bot.launch()

