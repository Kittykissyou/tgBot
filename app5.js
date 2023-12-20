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
      'https://script.google.com/macros/s/AKfycbzT4QMYCs_k1FdeeMyAgQviQrgW1NFDfi9V0wg8GjLkUJcfSv3KhbVCjFQ4JIYetjPEXQ/exec';
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.data = data;
  }
}

let report = {};
/*
const numberKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '1', callback_data: 1 },
        { text: '2', callback_data: 2 },
        { text: '3', callback_data: 3 },
      ],
      [
        { text: '4', callback_data: 4 },
        { text: '5', callback_data: 5 },
        { text: '6', callback_data: 6 },
      ],
      [
        { text: '7', callback_data: 7 },
        { text: '8', callback_data: 8 },
        { text: '9', callback_data: 9 },
      ],
      [{ text: '0', callback_data: 0 }],
    ],
  }),
};
*/
const booleanKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Все верно', callback_data: 'true' }],
      [{ text: 'Изменить', callback_data: 'false' }],
    ],
  }),
};

const reportFunction = (chat, user, message, userName, tgName) => {
  if (message === '/start') {
    bot.sendMessage(
      user,
      `Привет, ${userName}!\nНе отвечай на это сообщение!\nЯ напишу тебе сам, после того как ты напишешь вечерний отчет.`
    );
  } else {
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
        user === 6368983749 || // Бондаренко
        user === 5805007839 // Иванова Нина
      ) {
        bot.sendMessage(user, `Привет, ${userName}!`);
        bot.sendMessage(user, 'Cколько сегодня было БС');
      }
    }

    if (chat === user) {
      if (message / 0 === Infinity || message == 0) {
        if (!report.svk && !report.bs) {
          report.svk = userName + ' ' + tgName;
          report.bs = Number(message);
          return bot.sendMessage(user, `Сколько было фондирований`);
        }

        if (report.funding === undefined) {
          if (Number(message) <= report.bs) {
            report.funding = Number(message);
            return bot.sendMessage(
              user,
              `Сколько всего было предложений по Кросс КК или Комбо`
            );
          } else {
            return bot.sendMessage(
              user,
              `Количество фондирований не может быть больше количества открытых БС (${report.bs} шт.)`
            );
          }
        }
        if (report.offerKK === undefined) {
          report.offerKK = Number(message);
          return bot.sendMessage(user, 'Сколько из них было фактически выдано');
        }
        if (report.crossKK === undefined) {
          if (Number(message) <= report.offerKK) {
            report.crossKK = Number(message);
            report.refusalOfferKK = report.offerKK - report.crossKK;
            return bot.sendMessage(user, `Сколько было кросс ДК`);
          } else {
            return bot.sendMessage(
              user,
              `Количество кросс КК не может быть больше количества предложений по кросс КК (${report.offerKK} шт.)`
            );
          }
        }

        if (report.crossDK === undefined) {
          report.crossDK = Number(message);
          return bot.sendMessage(user, 'Сколько было всего выдано Селфи ДК');
        }
        if (report.selfieDK === undefined) {
          report.selfieDK = Number(message);
          return bot.sendMessage(user, 'Сколько было всего выдано Селфи КК');
        }

        if (report.selfieKK === undefined) {
          report.selfieKK = Number(message);
          return bot.sendMessage(user, 'Сколько всего было клиентов с айфоном');
        }
        if (report.iphone === undefined) {
          report.iphone = Number(message);
          return bot.sendMessage(
            user,
            'Сколько было установлено приложений на айфон'
          );
        }
        if (report.ios === undefined) {
          if (Number(message) <= report.iphone) {
            report.ios = Number(message);
            return bot.sendMessage(user, 'Сколько было всего сделано ЦП');
          } else {
            return bot.sendMessage(
              user,
              `Количество установок приложения на айфон не может быть больше общего количества айфонов (${report.iphone} шт.)`
            );
          }
        }

        if (report.cp === undefined) {
          report.cp = Number(message);
          report.date = moment().add(6, 'hours').format('DD.MM.YYYY HH:mm:ss');

          bot.sendMessage(
            user,
            `Подтвердите данные перед отправкой\nБС ${report.bs}\nФондирований ${report.funding}\nПредложений по кросс КК ${report.offerKK}\nКросс КК ${report.crossKK}\nКросс ДК ${report.crossDK}\nСелфи ДК ${report.selfieDK}\nСелфи КК ${report.selfieKK}\nАйфонов ${report.iphone}\nУстановок приложения ${report.ios}\nЦП ${report.cp}`,
            booleanKeyboard
          );
        }
      } else {
        bot.sendMessage(user, 'Ответ должен содержать числовое значение');
      }
    }
  }
};
bot.on('message', async (msg) => {
  const chat = msg.chat.id;
  const user = msg.from.id;
  const message = msg.text;
  const userName = msg.from.first_name;
  const tgName = msg.from.username;
  reportFunction(chat, user, message, userName, tgName);
});
bot.on('callback_query', (msg) => {
  const user = msg.from.id;
  let data = msg.data === 'true' ? true : false;
  if (data) {
    const googleData = new Config(report);
    let bonus =
      report.funding * 600 +
      report.crossKK * 470 +
      report.crossDK * 300 +
      report.selfieDK * 300 +
      report.selfieKK * 470 +
      report.cp * 100;
    report = {};
    axios
      .request(googleData)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return bot.sendMessage(
          user,
          `Спасибо за отчет!\nПо моим подсчетам, твоя премия за кросс-продукты составляет ${bonus} руб.`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    report = {};
    bot.sendMessage(user, 'Сколько было БС');
  }
});
