const axios = require('axios');
const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const token = '8060415010:AAHDvgqz6bAEXwGl-9khfWgJ0nnMOO9ZlQ4';
const bot = new TelegramApi(token, { polling: true });
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://script.google.com/macros/s/AKfycbyZxSBXoAKJ6CGRTPUXQJB--_j1TNxhHA_UyFH8SWyd_Ww2SKQpHOFZDT7k2Zwi8udEuQ/exec',
  headers: {},
};
setInterval(() => {
  axios
    .request(config)
    .then((response) => {
      if (response.data.length != 0) {
        let report = response.data;
        for (let i = 0; i <= response.data.length - 1; i++) {
          bot.sendMessage(
            847331105,
            `*${moment()
              .add(6, 'hours')
              .format('DD.MM.YYYY HH:mm')}*\n\n*Новая задача!*\n${
              report[i].task
            }\n*Дата постановки:* ${moment(report[i].dateStart).format(
              'DD.MM.YYYY'
            )}\n*Дата завершения:* ${moment(report[i].dateFinish).format(
              'DD.MM.YYYY'
            )}\n${
              report[i].description != ''
                ? `*Комментарий:* ${report[i].description}`
                : ``
            }\n${report[i].person === 'Все' ? `*Для всех.*` : ''}`,
            { parse_mode: 'Markdown' }
          );
        }
      }
    })
    .catch((error) => {
      bot.sendMessage(847331105, `У нас ошибка:\n${error}`);
    });
}, 3600000);
