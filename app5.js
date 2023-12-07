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
      'https://script.google.com/macros/s/AKfycbwsIODbc_SX9dNlUW3KJLH36XBrgfmiDD3A9WXCeRM43ix5bOlTJX6837Jv7-GKbgEMNg/exec';
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
  iphone: undefined,
  ios: undefined,
  date: undefined,
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
    /*
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://script.google.com/macros/s/AKfycbxzasy7td4YGLjMU3o-q5UrmFG3JtOdiJw5lBKcxCzYoulgBB4Acr_OGmtOwIisIoDTKg/exec?data=${
        msg.from.first_name + ' ' + msg.from.username
      }`,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        if (!response.data) {
        } else {
          bot.sendMessage(user, `Сегодня вы уже давали отчет`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    /*
  setInterval(() => {
    //.add(6, 'hours')
    if (moment().format('HH:mm') === '17:52') {
      person = false;
      console.log('Можно давать отчет');
    } else {
      console.log('пока рано');
    }
  }, 60000);
  */
    if (
      chat === -1001821085070 || // вечерняя
      chat === -4071454549 || // тест3
      chat === -1002013109097 // тест 2
    ) {
      if (
        user === 998602268 || // Кирилл дж.
        user === 5230054339 || // Мария Дружинина
        user === 883783073 || //Галя
        user === 346256185 || //гончаров
        user === 1379125664 || //репина
        user === 847331105 || //я
        user === 762856078 || // Кондратьева
        user === 5477500698 || // Герман А.
        user === 1643994830 || // факторович
        user === 1934358785 || // Нагулина
        user === 1438443038 || // Чистая
        user === 1254362058 || // Кречетов
        user === 5128220724 || // Конюкова
        user === 483942491 || // Быкова
        user === 6368983749 // Бондаренко
      ) {
        bot.sendMessage(user, `Привет, ${msg.from.first_name}!`);
        bot.sendMessage(user, 'Напиши сюда сколько сегодня было БС');
      }
    }

    if (chat === user) {
      if (msg.text / 0 === Infinity || msg.text == 0) {
        if (!report.svk && !report.bs) {
          report.svk = msg.from.first_name + ' ' + msg.from.username;

          report.bs = Number(msg.text);
          return bot.sendMessage(user, `Сколько было фондирований`);
        }

        if (report.funding === undefined) {
          report.funding = Number(msg.text);
          return bot.sendMessage(
            user,
            `Сколько всего было предложений по Кросс КК или Комбо`
          );
        }
        if (report.offerKK === undefined) {
          report.offerKK = Number(msg.text);
          return bot.sendMessage(user, 'Сколько из них было фактически выдано');
        }
        if (report.crossKK === undefined) {
          report.crossKK = Number(msg.text);
          report.refusalOfferKK = report.offerKK - report.crossKK;
          return bot.sendMessage(user, `Сколько было кросс ДК`);
        }
        /*
      if (report.refusalOfferKK === undefined) {
        report.refusalOfferKK = Number(msg.text);
        return bot.sendMessage(user, 'Сколько было кросс ДК');
      }
      */
        if (report.crossDk === undefined) {
          report.crossDk = Number(msg.text);
          return bot.sendMessage(user, 'Сколько было всего выдано Селфи ДК');
        }
        if (report.selfieDK === undefined) {
          report.selfieDK = Number(msg.text);
          return bot.sendMessage(user, 'Сколько было всего выдано Селфи КК');
        }

        if (report.selfieKK === undefined) {
          report.selfieKK = Number(msg.text);
          return bot.sendMessage(user, 'Сколько всего было клиентов с айфоном');
        }
        if (report.iphone === undefined) {
          report.iphone = Number(msg.text);
          return bot.sendMessage(
            user,
            'Сколько было установлено приложений на айфон'
          );
        }
        if (report.ios === undefined) {
          report.ios = Number(msg.text);
          return bot.sendMessage(user, 'Сколько было всего сделано ЦП');
        }

        if (report.cp === undefined) {
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
                selfieDK: undefined,
                selfieKK: undefined,
                iphone: undefined,
                ios: undefined,
                date: undefined,
              };
              person = true;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        bot.sendMessage(user, 'Ответ должен содержать числовое значение');
      }
    }
  }
});
