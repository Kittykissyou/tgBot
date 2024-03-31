const axios = require('axios');
const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const token = '6690542008:AAETnJRiedUZguKNKBsTH7mqVqI4gMXUPRM';
const bot = new TelegramApi(token, { polling: true });
let report = {};
let isСonsumption = false;
let isCriterionNext = false;
let googleData = {};
class Config {
  constructor(data) {
    this.method = 'post';
    this.maxBodyLength = Infinity;
    this.url =
      'https://script.google.com/macros/s/AKfycbwKANYPVFTHiwGDEvxpSbB9C0rJvWOz6mj4LxMj63btZ5JNQSG0B_n7awAaIMbQ0P0/exec';
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.data = data;
  }
}
const booleanKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Да', callback_data: 'true' }],
      [{ text: 'Нет', callback_data: 'false' }],
    ],
  }),
};
const categoryKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'Расход', callback_data: 'Расход' },
        { text: 'Доход', callback_data: 'Доход' },
      ],
    ],
  }),
};
const consumptionCriterionKeys = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'Еда', callback_data: 'Еда' },
        { text: 'Бытовые расходы', callback_data: 'Бытовые расходы' },
      ],
      [
        { text: 'Развлечения', callback_data: 'Развлечения' },
        { text: 'Заправка', callback_data: 'Заправка' },
      ],
      [{ text: 'Обязательные расходы', callback_data: 'Обязательные расходы' }],
    ],
  }),
};
const incomeCriterionKeys = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Заработная плата', callback_data: 'ЗП' }],
      [{ text: 'Прочие доходы', callback_data: 'Прочие доходы' }],
    ],
  }),
};
const reportFunction = (chat, user, message) => {
  if (user === 847331105) {
    if (message === '/report') {
      return bot.sendMessage(
        user,
        `Выбери категорию финансовой операции`,
        categoryKeyboard
      );
    } else {
      if (report.amount === undefined) {
        report.amount = Number(message);
        return bot.sendMessage(user, `Укажи описание транзакции`);
      }
      if (report.description === undefined) {
        report.description = message;
        report.date = moment().add(6, 'hours').format('DD.MM.YYYY');
        report.time = moment().add(6, 'hours').format('HH:mm');
        googleData = new Config(report);
        postDataHandler(googleData, user);
      }
    }
  }
};

bot.on('message', async (msg) => {
  const chat = msg.chat.id;
  const user = msg.from.id;
  const message = msg.text;
  reportFunction(chat, user, message);
});
bot.on('callback_query', (msg) => {
  const user = msg.from.id;
  const userName = msg.from.first_name;
  const tgName = msg.from.username;
  let data = msg.data;
  if (data === 'Расход' || data === 'Доход') {
    report.category = data;
    report.category === 'Расход'
      ? (isСonsumption = true)
      : (isСonsumption = false);
    isCriterionNext = true;
    return bot.sendMessage(
      user,
      `Укажи критерий операции`,
      isСonsumption ? consumptionCriterionKeys : incomeCriterionKeys
    );
  }
  if (isCriterionNext) {
    report.criterion = data;
    return bot.sendMessage(user, `Укажи cумму операции`);
  }
  if (data === 'true') {
    postDataHandler(googleData, user);
  }
  if (data === 'false') {
    report = {};
    isСonsumption = false;
    isCriterionNext = false;
    return bot.sendMessage(user, `Все данные сброшены`);
  }
});
const postDataHandler = (data, user) => {
  bot.sendMessage(user, `Отправляю данные на сервер`);
  axios
    .request(data)
    .then((response) => {
      isСonsumption = false;
      isCriterionNext = false;
      report = {};
      return bot.sendMessage(user, `${response.data}`);
    })
    .catch((error) => {
      return bot.sendMessage(
        user,
        `При отправке отчета возникла ошибка\n${error}\nповторить попытку?`,
        booleanKeyboard
      );
    });
};
