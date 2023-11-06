const axios = require('axios');
const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const token = '6380678892:AAEKDYsjxbkNGlezSAVQw3qLV1fah0dKr2k';
const bot = new TelegramApi(token, { polling: true });
class Config {
  constructor(data) {
    this.method = 'post';
    this.maxBodyLength = Infinity;
    this.url =
      'https://script.google.com/macros/s/AKfycbxVdvzu2jIuNtyPnK53qLo7dpXFHoD2MaKC_uL5pmQ2yzoomfLuqFYZw8aIcPgLimS7Iw/exec';
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.data = data;
  }
}
let report = {
  svk: undefined,
  crossKK: undefined,
  selfie: undefined,
  bs: undefined,
  cp: undefined,
};
bot.on('message', async (msg) => {
  const chat = msg.chat.id;
  const user = msg.from.id;

  if (chat === -1001821085070 || chat === -4071454549) {
    if (
      user === 383782832 ||
      user === 346256185 ||
      user === 1379125664 ||
      user === 847331105
    ) {
      await bot.sendMessage(user, `Привет, ${msg.from.first_name}!`);
      await bot.sendMessage(
        user,
        'Напиши сюда сколько было Кросс КК или Комбо'
      );
    }

    /*
    await bot.sendMessage(
      user,
      `Напиши через пробел свои продажи за сегодняшний день. Например если у тебя было:`
    );
    await bot.sendMessage(
      user,
      `Кросс/Комбо 2 \n Селфи ДК 3 \n Селфи КК 1 \n Фондирование БС 4 \n ЦП 10`
    );
    await bot.sendMessage(
      user,
      `Твой отчет должен выглядеть следующим образом:\n 2 3 1 4 10`
    );
    */
  }

  if (chat === user) {
    if (!report.svk && !report.crossKK) {
      report.svk = msg.from.first_name + ' ' + msg.from.username;
      report.crossKK = Number(msg.text);
      return bot.sendMessage(user, `Сколько было БС`);
    }

    if (!report.bs) {
      report.bs = Number(msg.text);
      return bot.sendMessage(user, `Сколько было ЦП`);
    }
    if (!report.cp) {
      report.cp = Number(msg.text);
      return bot.sendMessage(user, `Сколько было Селфи`);
    }
    if (!report.selfie) {
      report.selfie = Number(msg.text);
      bot.sendMessage(user, `Спасибо за очет!`);
      const googleData = new Config(report);
      axios
        .request(googleData)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          report = {
            svk: undefined,
            crossKK: undefined,
            selfie: undefined,
            bs: undefined,
            cp: undefined,
          };
        })
        .catch((error) => {
          console.log(error);
        });
    }

    /*
    const message = msg.text;
    const svk = msg.from.first_name + ' ' + msg.from.username;
    const splits = message.split(' ');
    let crossKK = splits[0];
    let selfieDk = 0;
    let selfieKK = 0;
    let selfie = splits[1];
    let bs = splits[2];
    let cp = splits[3];

    const googleData = new Config({ svk, crossKK, selfie, bs, cp });
    axios
      .request(googleData)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
      */
  }
});
