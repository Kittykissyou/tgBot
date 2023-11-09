const axios = require('axios');
const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const token = '6643944827:AAEud3mnVvQmj-IoG3tPqOLIkNq82By1WoM';
const bot = new TelegramApi(token, { polling: true });
class Config {
  constructor(data) {
    this.method = 'post';
    this.maxBodyLength = Infinity;
    this.url =
      'https://script.google.com/macros/s/AKfycbzjHTmOCtx5_RBhmnAnYJGuhqNlrDxrT8BYN8C_HN7ighh7nVCz0Au63ivjN6o-Z7QhQg/exec';
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.data = data;
  }
}

let report = {
  svk: undefined,
  bs: undefined,
  funding: undefined,
  offerKK: undefined,
  crossKK: undefined,
  refusalOfferKK: undefined,
  selfieDK: undefined,
  selfieKK: undefined,
  cp: undefined,
  date: undefined,
  //selfie: undefined,
};

bot.on('message', async (msg) => {
  const chat = msg.chat.id;
  const user = msg.from.id;
  const message = msg.text;

  if (message === '/start') {
    bot.sendMessage(
      user,
      `Привет, ${msg.from.first_name}!\nНе отвечай на это сообщение!\nЯ напишу тебе сам, после того как ты напишешь вечерний отчет.`
    );
    console.log(
      `${msg.from.first_name + ' ' + msg.from.username} is avalible now`
    );
  } else {
    if (
      chat === -1001821085070 || // вечерняя
      chat === -4071454549 || // тест3
      chat === -1002013109097 // тест 2
    ) {
      if (
        user === 383782832 || //Жуков
        user === 346256185 || //гончаров
        user === 1379125664 || //репина
        user === 847331105 || //я
        user === 736294274 // кирилл
      ) {
        await bot.sendMessage(user, `Привет, ${msg.from.first_name}!`);
        await bot.sendMessage(user, 'Напиши сюда сколько сегодня было БС');
      }
    }

    if (chat === user) {
      if (!report.svk && !report.bs) {
        report.svk = msg.from.first_name + ' ' + msg.from.username;
        report.bs = Number(msg.text);
        return bot.sendMessage(user, `Сколько было фондирований`);
      }

      if (!report.funding) {
        report.funding = Number(msg.text);
        return bot.sendMessage(
          user,
          `Сколько всего было предложений по Кросс КК или Комбо`
        );
      }
      if (!report.offerKK) {
        report.offerKK = Number(msg.text);
        return bot.sendMessage(user, 'Сколько из них было фактически выдано');
      }
      if (!report.crossKK) {
        report.crossKK = Number(msg.text);
        return bot.sendMessage(user, `Сколько из них было отказов`);
      }
      if (!report.refusalOfferKK) {
        report.refusalOfferKK = Number(msg.text);
        return bot.sendMessage(user, 'Сколько было кросс ДК');
      }
      if (!report.crossDk) {
        report.crossDk = Number(msg.text);
        return bot.sendMessage(user, 'Сколько было всего выдано Селфи ДК');
      }
      if (!report.selfieDK) {
        report.selfieDK = Number(msg.text);
        return bot.sendMessage(user, 'Сколько было всего выдано Селфи КК');
      }
      if (!report.selfieKK) {
        report.selfieKK = Number(msg.text);
        return bot.sendMessage(user, 'Сколько было всего выдано ЦП');
      }
      if (!report.cp) {
        report.cp = Number(msg.text);
        report.date = moment().add(6, 'hours').format('DD.MM.YYYY HH:mm:ss');
        bot.sendMessage(user, 'Спасибо за отчет!');
        const googleData = new Config(report);
        axios
          .request(googleData)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            report = {
              svk: undefined,
              bs: undefined,
              funding: undefined,
              offerKK: undefined,
              crossKK: undefined,
              refusalOfferKK: undefined,
              crossDk: undefined,
              selfie: undefined,
              cp: undefined,
              date: undefined,
            };
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
});
