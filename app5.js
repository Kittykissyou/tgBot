const axios = require('axios');
const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const token = '6643944827:AAEud3mnVvQmj-IoG3tPqOLIkNq82By1WoM';
const bot = new TelegramApi(token, { polling: true });
const reports = [];
class Config {
  constructor(data) {
    this.method = 'post';
    this.maxBodyLength = Infinity;
    this.url =
      'https://script.google.com/macros/s/AKfycbxSz7L_4DXB_oKFhLhLBVr_NyxUISfEkusygYzkau9Z39c-F1bEZCfVVHSbDwDs3T0D/exec';
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.data = data;
  }
}

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
    if (chat === -4071454549 || chat === -1001821085070) {
      if (
        user === 811314596 || // Богодухов Гриша
        user === 750555162 || // Иван СВК
        user === 884196288 || // Никита Зизевский
        user === 6023512837 || // Александра Ш.
        user === 697095295 || // Ксения Евсеева
        user === 962287015 || // Пляскин Олег
        user === 323413770 || // Бутолин Александр
        user === 924315037 || // Демиденок Иван
        user === 5410269834 || // Малофеева Кристина
        user === 5867073053 || // Миронова Юлия
        user === 1302023476 || // Сангаева Виктория
        user === 1082648927 || // Аня Титова
        user === 1344510807 || // Алексей
        user === 402709516 || // Алена моя
        user === 847331105 || //я
        user === 5230054339 || // Мария Дружинина
        user === 883783073 || //Галя
        user === 346256185 || //гончаров
        user === 1379125664 || //репина
        user === 762856078 || // Кондратьева
        user === 5477500698 || // Герман А.
        user === 1643994830 || // факторович
        user === 1934358785 || // Нагулина
        user === 1438443038 || // Чистая
        user === 1254362058 || // Кречетов
        user === 5128220724 || // Конюкова
        user === 6368983749 // Бондаренко
      ) {
        bot.sendMessage(user, `Привет, ${userName}!`);
        bot.sendMessage(user, 'Cколько сегодня было БС');
      }
    }

    if (chat === user) {
      if (message / 0 === Infinity || message == 0) {
        if (reports.length == 0) {
          reports.push({ svk: userName + ' ' + tgName, bs: Number(message) });
          return bot.sendMessage(
            user,
            `Сколько было фондирований, т.е пополнений брокерского счета без покупки акций на бирже`
          );
        } else {
          for (let i = 0; i < reports.length; i++) {
            if (reports[i].svk === userName + ' ' + tgName) {
              if (reports[i].bs == undefined) {
                reports[i].bs = Number(message);
                return bot.sendMessage(
                  user,
                  `Сколько было фондирований, т.е пополнений брокерского счета без покупки акций на бирже`
                );
              }
              if (reports[i].funding == undefined) {
                if (Number(message) <= reports[i].bs) {
                  reports[i].funding = Number(message);
                  return bot.sendMessage(
                    user,
                    `Сколько было покупок акций с клиентом на бирже`
                  );
                } else {
                  return bot.sendMessage(
                    user,
                    `Количество фондирований не может быть больше количества открытых БС (${reports[i].bs} шт.)`
                  );
                }
              }
              if (reports[i].stock == undefined) {
                if (Number(message) <= reports[i].bs) {
                  reports[i].stock = Number(message);
                  return bot.sendMessage(
                    user,
                    `Сколько всего было предложений по Кросс КК или Комбо`
                  );
                } else {
                  return bot.sendMessage(
                    user,
                    `Количество покупок акций не может быть больше количества открытых БС (${reports[i].bs} шт.)`
                  );
                }
              }

              if (reports[i].offerKK == undefined) {
                reports[i].offerKK = Number(message);
                return bot.sendMessage(
                  user,
                  'Сколько из них было фактически выдано'
                );
              }
              if (reports[i].crossKK === undefined) {
                if (Number(message) <= reports[i].offerKK) {
                  reports[i].crossKK = Number(message);
                  reports[i].refusalOfferKK =
                    reports[i].offerKK - reports[i].crossKK;
                  return bot.sendMessage(user, `Сколько было кросс ДК`);
                } else {
                  return bot.sendMessage(
                    user,
                    `Количество кросс КК не может быть больше количества предложений по кросс КК (${reports[i].offerKK} шт.)`
                  );
                }
              }
              if (reports[i].crossDK === undefined) {
                reports[i].crossDK = Number(message);
                return bot.sendMessage(
                  user,
                  'Сколько было всего выдано Селфи ДК'
                );
              }
              if (reports[i].selfieDK === undefined) {
                reports[i].selfieDK = Number(message);
                return bot.sendMessage(
                  user,
                  'Сколько было всего выдано Селфи КК'
                );
              }
              if (reports[i].selfieKK === undefined) {
                reports[i].selfieKK = Number(message);
                return bot.sendMessage(
                  user,
                  'Сколько всего было клиентов с айфоном'
                );
              }
              if (reports[i].iphone === undefined) {
                reports[i].iphone = Number(message);
                return bot.sendMessage(
                  user,
                  'Сколько было установлено приложений на айфон'
                );
              }
              if (reports[i].ios === undefined) {
                if (Number(message) <= reports[i].iphone) {
                  reports[i].ios = Number(message);
                  return bot.sendMessage(user, 'Сколько было всего сделано ЦП');
                } else {
                  return bot.sendMessage(
                    user,
                    `Количество установок приложения на айфон не может быть больше общего количества айфонов (${reports[i].iphone} шт.)`
                  );
                }
              }

              if (reports[i].cp === undefined) {
                reports[i].cp = Number(message);
                reports[i].date = moment()
                  .add(6, 'hours')
                  .format('DD.MM.YYYY HH:mm:ss');

                bot.sendMessage(
                  user,
                  `Подтвердите данные перед отправкой\nБС ${reports[i].bs}\nФондирований ${reports[i].funding}\nПокупок акций ${reports[i].stock}\nПредложений по кросс КК ${reports[i].offerKK}\nКросс КК ${reports[i].crossKK}\nКросс ДК ${reports[i].crossDK}\nСелфи ДК ${reports[i].selfieDK}\nСелфи КК ${reports[i].selfieKK}\nАйфонов ${reports[i].iphone}\nУстановок приложения ${reports[i].ios}\nЦП ${reports[i].cp}`,
                  booleanKeyboard
                );
              }
            } else {
              if (!reports.find((el) => el.svk == userName + ' ' + tgName)) {
                reports.push({
                  svk: userName + ' ' + tgName,
                });
              }
            }
          }
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
  const userName = msg.from.first_name;
  const tgName = msg.from.username;
  let data = msg.data === 'true' ? true : false;
  let report = reports.find((el) => el.svk == userName + ' ' + tgName);
  let deleteIndex = reports.indexOf(report);
  if (data) {
    const googleData = new Config(report);
    let bonus =
      report.funding * 600 +
      report.crossKK * 470 +
      report.crossDK * 300 +
      report.selfieDK * 300 +
      report.selfieKK * 470 +
      report.cp * 100;

    axios
      .request(googleData)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        reports.splice(deleteIndex, 1);
        return bot.sendMessage(
          user,
          `Спасибо за отчет!\nПо моим подсчетам, твоя премия за кросс-продукты составляет ${bonus} руб.`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    reports.splice(deleteIndex, 1);
    bot.sendMessage(user, 'Сколько было БС');
  }
});
