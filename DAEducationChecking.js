const axios = require('axios');
const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const token = '7696620039:AAEuyJG4j5NqI5uZEL7xPfXBg8LRzftWtIw';
const bot = new TelegramApi(token, { polling: true });
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://script.google.com/macros/s/AKfycbyudAv2JoZNdX56qNrznR2QJIRpEXJEdN9VLttld0MCM0jg7SYf0ODkgKPHaQl5JBny/exec',
  headers: {},
};
let VGETable =
  'https://docs.google.com/spreadsheets/d/1AXDdaY4Q2LNjesizEUi2Ws3H2AEiNJQt3SDE_yAZ80E/edit#gid=0&range=';
let DATable =
  'https://docs.google.com/spreadsheets/d/1EfDUqsrGc138iDxCOYq6JTJwzrBcADVcZXSbGgXYBWA/edit#gid=1&range=';

setInterval(() => {
  axios

    .request(config)
    .then((response) => {
      let report = response.data;

      // Формируем тело сообщения
      let messageBody = '';

      // Проверяем, есть ли вообще изменения
      if (report.length > 0) {
        if (report.length < 100) {
          // Добавляем шапку сообщения
          messageBody += `*Актуальные изменения:*\n\n`;

          // Собираем изменения в одну строку
          for (let i = 0; i < report.length; i++) {
            // Составляем URL для гиперссылки на ячейку
            const SPREADSHEET_URL = DATable + report[i].cell;

            // Оформляем гиперссылку на ячейку
            const cellLink = `[Ячейка ${report[i].cell}](${SPREADSHEET_URL})`;

            messageBody += `${cellLink}: ${
              report[i].old === '' || report[i].old === undefined
                ? `новое значение *"${report[i].new}"*`
                : `старое значение *"${report[i].old}"*, новое значение *"${report[i].new}"*`
            }\n`;
          }

          // Отправляем единое сообщение
          try {
            bot.sendMessage(-1002127559248 /*847331105*/, messageBody, {
              parse_mode: 'Markdown',
            });
          } catch (err) {
            bot.sendMessage(
              847331105,
              `Ошибка при отправке сообщения: ${err.message}`
            );
          }
        } else {
          try {
            bot.sendMessage(
              -1002127559248 /*847331105*/,
              `*Первичная конфигурация сохранена*\n\nОбъем ${report.length} строк`,
              {
                parse_mode: 'Markdown',
              }
            );
          } catch (err) {
            bot.sendMessage(
              847331105,
              `Ошибка при отправке сообщения: ${err.message}`
            );
          }
        }
      }
    })
    .catch((error) => {
      bot.sendMessage(847331105, `У нас ошибка:\n${error}`);
    });
}, 7200000);
