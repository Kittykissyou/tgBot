const axios = require('axios');
/*
const TelegramApi = require('node-telegram-bot-api');
const token = '6855752765:AAFl8XTDxyUaO0NMvDhQDS-eFO1nY2zmxH8';
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
bot.on('message', (msg) => {
  bot.getUpdates(100, 99);
});
/*
bot.on('message', (msg) => {
  let message;
  let splits;
  if (msg.photo) {
    message = msg.caption;
    splits = message.split('\n');
  } else {
    message = msg.text;
    splits = message.split('\n');
  }
  if (splits[0].trim().toLowerCase() === 'клиент') {
    //console.log(splits);
    const svk = msg.from.first_name + ' ' + msg.from.last_name;
    let crossKK = 0;
    let selfie = 0;
    let bs = 0;
    let cp = 0;

    for (let i = 0; i < splits.length; i++) {
      if (splits[i].split(' ')[0].toLowerCase() === 'селфи') {
        selfie = splits[i].split(' ')[1] === '+' ? 1 : 0;
      }
      if (splits[i].split(' ')[0].toLowerCase() === 'бс') {
        bs = splits[i].split(' ')[1] === '+' ? 1 : 0;
      }
      if (splits[i].split(' ')[0].toLowerCase() === 'кросс') {
        crossKK = splits[i].split(' ')[1] === '+' ? 1 : 0;
      }
      if (splits[i].split(' ')[0].toLowerCase() === 'цп') {
        cp = splits[i].split(' ')[1] === '+' ? 1 : 0;
      }
    }
    const googleData = new Config({ svk, selfie, bs, crossKK, cp });

    axios
      .request(googleData)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log('это сообщение не содержит отчет по клиенту');
  }
});
*/
