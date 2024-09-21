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
      'https://script.google.com/macros/s/AKfycbzBBSMn8jHcxgMlVwXrZgXM3mRCvHLCLf6Gq8n-EDtdvfyRCwZ1Y2nnEiY-jnjsOZpaHw/exec';
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.data = data;
  }
}
let todayDate = moment().add(6, 'hours').format('DD.MM.YYYY');
let yesterdayDate = moment()
  .add(6, 'hours')
  .subtract(1, 'days')
  .format('DD.MM.YYYY');
const booleanKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Все верно', callback_data: 'true' }],
      [{ text: 'Изменить', callback_data: 'false' }],
    ],
  }),
};
const chooseDateKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Сегодня', callback_data: 'today' }],
      [{ text: 'Вчера', callback_data: 'yesterday' }],
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
        user === 1092342019 || // Пивоварова Ирина
        user === 418834424 || // Кульгина Нина
        user === 962287015 || // Пляскин Олег
        user === 845963997 || // Каспирович Алексей
        user === 969002759 || // Чернецкая Катерина
        user === 6763261388 || // Лосева Вера
        user === 961774918 || // Тимашева Светлана
        user === 1630679559 || // Барковская Анастасия
        user === 884196288 || // Никита Зизевский
        user === 697095295 || // Ксения Евсеева
        user === 323413770 || // Бутолин Александр
        user === 924315037 || // Демиденок Иван
        user === 5410269834 || // Малофеева Кристина
        user === 5867073053 || // Миронова Юлия
        user === 1302023476 || // Сангаева Виктория
        user === 1344510807 || // Панфилов Алексей
        user === 402709516 || // Алена моя
        user === 847331105 || //я
        user === 346256185 || //Гончаров Андрей
        user === 1379125664 || //Репина Валерия
        user === 762856078 || // Кондратьева Наталья
        user === 5477500698 || // Герман А.
        user === 1934358785 || // Нагулина
        user === 1438443038 || // Чистая
        user === 1254362058 || // Кречетов
        user === 5128220724 || // Конюкова
        user === 207893136 || // Захожев
        user === 1235827483 || // Быкова Екатерина
        user === 321171970 || // Цунвентун
        user === 1548908812 || // Прокопчук
        user === 6368983749 || // Бондаренко
        user === 948316629 // Фомина
      ) {
        bot.sendMessage(user, `Привет, ${userName}!`);
        return bot.sendMessage(user, `Выбери дату отчета`, chooseDateKeyboard);
      }
    }

    if (chat === user) {
      if (message / 0 === Infinity || message == 0) {
        if (reports.length == 0) {
          reports.push({
            svk: userName + ' ' + tgName,
            stock: Number(message),
          });
          return bot.sendMessage(
            user,
            `Сколько Кросс КК или Комбо фактически предоставлено`
          );
        } else {
          for (let i = 0; i < reports.length; i++) {
            if (reports[i].svk === userName + ' ' + tgName) {
              if (reports[i].stock == undefined) {
                reports[i].stock = Number(message);
                return bot.sendMessage(
                  user,
                  `Сколько было фондирований инвесткопилки на сумму > 1000 рублей с настроенным автопополнением`
                );
              }
              if (reports[i].investfouding == undefined) {
                reports[i].investfouding = Number(message);
                return bot.sendMessage(
                  user,
                  `Сколько Кросс КК или Комбо фактически предоставлено`
                );
              }
              if (reports[i].crossKK == undefined) {
                reports[i].crossKK = Number(message);
                return bot.sendMessage(user, `Сколько было кросс ДК`);
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
                if (reports[i].iphone == 0) {
                  reports[i].ios = 0;
                  return bot.sendMessage(user, 'Сколько было всего сделано ЦП');
                } else {
                  return bot.sendMessage(
                    user,
                    'Сколько было установлено приложений на айфон'
                  );
                }
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
                reports[i].time = moment()
                  .add(6, 'hours')
                  .format('DD.MM.YYYY HH:mm:ss');

                bot.sendMessage(
                  user,
                  `Подтвердите данные перед отправкой\nПокупок акций ${reports[i].stock}\nФондирований инвесткопилок ${reports[i].investfouding}\nКросс КК/Комбо ${reports[i].crossKK}\nКросс ДК ${reports[i].crossDK}\nСелфи ДК ${reports[i].selfieDK}\nСелфи КК ${reports[i].selfieKK}\nАйфонов ${reports[i].iphone}\nУстановок приложения ${reports[i].ios}\nЦП ${reports[i].cp}`,
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
  let data = msg.data;
  let report = reports.find((el) => el.svk == userName + ' ' + tgName);
  let deleteIndex = reports.indexOf(report);
  if (data == 'today' || data == 'yesterday') {
    reports.push({
      svk: userName + ' ' + tgName,
      date:
        data === 'today'
          ? todayDate
          : data === 'yesterday'
          ? yesterdayDate
          : {},
    });
    bot.sendMessage(
      user,
      'Сколько было покупок акций с клиентом на бирже на сумму > 1000 рублей'
    );
  }
  if (data == 'true') {
    const googleData = new Config(report);
    let bonus =
      report.stock * 380 +
      report.investfouding * 230 +
      report.crossKK * 510 +
      report.crossDK * 230 +
      report.selfieDK * 380 +
      report.selfieKK * 510 +
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
  }
  if (data == 'false') {
    reports.splice(deleteIndex, 1);
    return bot.sendMessage(user, `Выбери дату отчета`, chooseDateKeyboard);
  }
});

// const booleanKeyboard = {
//   reply_markup: JSON.stringify({
//     inline_keyboard: [
//       [{ text: 'Все верно', callback_data: 'true' }],
//       [{ text: 'Изменить', callback_data: 'false' }],
//     ],
//   }),
// };
setInterval(() => {
  if (moment().add(6, 'hours').format('HH') === '00') {
    todayDate = moment().add(6, 'hours').format('DD.MM.YYYY');
    yesterdayDate = moment()
      .add(6, 'hours')
      .subtract(1, 'days')
      .format('DD.MM.YYYY');
  }
}, 3600000);
