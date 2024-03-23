const axios = require('axios');
const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const token = '6892709365:AAGa9BG4LR2CL9DU5ufS-SUbcfZp9YdtL9Y';
const bot = new TelegramApi(token, { polling: true });
const reports = [];
let data;
let todayDate = moment().add(6, 'hours').format('DD.MM.YYYY');
let yesterdayDate = moment()
  .add(6, 'hours')
  .subtract(1, 'days')
  .format('DD.MM.YYYY');

let isSecondNameReport = false;
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

const chooseDateKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: `${todayDate}`, callback_data: 'today' }],
      [{ text: `${yesterdayDate}`, callback_data: 'yesterday' }],
    ],
  }),
};
const booleanKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Да', callback_data: 'true' }],
      [{ text: 'Нет', callback_data: 'false' }],
    ],
  }),
};
const chooseStepKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Перейти к выбору причин', callback_data: 'chooseOfReason' }],
      [{ text: 'Перейти к другим продуктам', callback_data: 'continueReport' }],
      //[{ text: 'Изменить внесенные данные', callback_data: 'changeList' }],
      // Возможность изменять данные внесенные в ту или иную категорию
    ],
  }),
};
const activReasonKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'тех. ошибка', callback_data: 'technicalErrorAct' }],
      [{ text: 'отказ клиента', callback_data: 'clientRejectAct' }],
    ],
  }),
};

const cardReasonKeyboard = {
  // посчет фамилий, чтобы не вносли меньше или больше, чем нужно Фиксировать фамилию >=2 символа
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'Клиент не отвечает', callback_data: '1' },
        { text: 'Перенос', callback_data: '2' },
      ],
      [
        {
          text: 'Номер неверный/недоступен/автоответчик',
          callback_data: '3',
        },
      ],
      [
        { text: 'Отмена по сроку', callback_data: '4' },
        { text: 'Тех. ошибка', callback_data: '5' },
      ],
      [{ text: 'Отсутствует/испорчен паспорт', callback_data: '6' }],
      [
        { text: 'Отказ Банка', callback_data: '7' },
        { text: 'Отказ клиента', callback_data: '8' },
      ],
      [{ text: 'Перейти к другим продуктам', callback_data: 'continueReport' }],
    ],
  }),
};

const secondNameReport = (chat, user, message, userName, tgName) => {
  // Логика только текстовых значений
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].svk === userName + ' ' + tgName) {
      //Нужна переделка полная в соотвестии с логикой несколькиъ продуктов
      if (data === '1') {
        if (reports[i].reFact) {
          reports[i].reMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].reMissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].mortgageMissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].zpcMissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].clMissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].pilMissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].rkoMissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2MissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].kk2MissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].kkMissedCall}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].dkMissedCall}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === '2') {
        if (reports[i].reFact) {
          reports[i].reTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].reTransfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].mortgageTransfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].zpcTransfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].clTransfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].pilTransfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].rkoTransfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2Transfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].kk2Transfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].kkTransfer}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].dkTransfer}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === '3') {
        if (reports[i].reFact) {
          reports[i].reUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].reUnavailable}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].mortgageUnavailable}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].zpcUnavailable}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].clUnavailable}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].pilUnavailable}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].rkoUnavailable}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2Unavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].kk2Unavailable}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].kkUnavailable}`,
            chooseStepKeyboard
          );
        }

        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].dkUnavailable}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === '4') {
        if (reports[i].reFact) {
          reports[i].reDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].reDeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].mortgageDeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].zpcDeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].clDeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].pilDeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].rkoDeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2DeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].kk2DeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].kkDeadlineCancel}`,
            chooseStepKeyboard
          );
        }

        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].dkDeadlineCancel}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === '5') {
        if (reports[i].reFact) {
          reports[i].reTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].reTecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].mortgageTecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].zpcTecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].clTecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].pilTecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].rkoTecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2TecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].kk2TecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].kkTecError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].dkTecError}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === '6') {
        if (reports[i].reFact) {
          reports[i].reDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].reDocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].mortgageDocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].zpcDocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].clDocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].pilDocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].rkoDocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2DocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].kk2DocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].kkDocReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].dkDocReject}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === '7') {
        if (reports[i].reFact) {
          reports[i].reBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].reBankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].mortgageBankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].zpcBankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].clBankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].pilBankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].rkoBankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2BankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].kk2BankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].kkBankReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].dkBankReject}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === '8') {
        if (reports[i].reFact) {
          reports[i].reClientReject = message;
          bot.sendMessage(
            user,
            `Отказ Клиента: ${reports[i].reClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].mortgageFact && reports[i].reFact === undefined) {
          reports[i].mortgageClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].mortgageClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].zpcFact && reports[i].mortgageFact === undefined) {
          reports[i].zpcClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].zpcClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].clFact && reports[i].zpcFact === undefined) {
          reports[i].clClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].clClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].pilFact && reports[i].clFact === undefined) {
          reports[i].pilClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].pilClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].rkoFact && reports[i].pilFact === undefined) {
          reports[i].rkoClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].rkoClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Fact && reports[i].rkoFact === undefined) {
          reports[i].kk2ClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].kk2ClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkFact && reports[i].kk2Fact === undefined) {
          reports[i].kkClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].kkClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].dkFact && reports[i].kkFact === undefined) {
          reports[i].dkClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].dkClientReject}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === 'technicalErrorAct') {
        if (reports[i].crossKkFact) {
          reports[i].crossKkTechError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].crossKkTechError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].crossDkFact && reports[i].crossKkFact === undefined) {
          reports[i].crossDkTechError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].crossDkTechError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Transaction && reports[i].crossDkFact === undefined) {
          reports[i].kk2TransactionTechError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка совершения транзакции: ${reports[i].kk2TransactionTechError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Ppi && reports[i].kk2Transaction === undefined) {
          reports[i].kk2PpiTechError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка подключения страховки: ${reports[i].kk2PpiTechError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Act && reports[i].kk2Ppi === undefined) {
          reports[i].kk2TechErrorAct = message;
          bot.sendMessage(
            user,
            `Техническая ошибка активации: ${reports[i].kk2TechErrorAct}`,
            chooseStepKeyboard
          );
        }

        if (reports[i].kkTransaction && reports[i].kk2Act === undefined) {
          reports[i].kkTransactionTechError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка совершения транзакции: ${reports[i].kkTransactionTechError}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkPpi && reports[i].kkTransaction === undefined) {
          reports[i].kkPpiTechError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка подключения страховки: ${reports[i].kkPpiTechError}`,
            chooseStepKeyboard
          );
        }
        if (
          (reports[i].kkAct && reports[i].kkPpi === undefined) ||
          (reports[i].kkAct === 0 && reports[i].kkPpi === undefined)
        ) {
          reports[i].kkTechErrorAct = message;
          bot.sendMessage(
            user,
            `Техническая ошибка активации: ${reports[i].kkTechErrorAct}`,
            chooseStepKeyboard
          );
        }
        if (
          (reports[i].dkAct && reports[i].kkAct === undefined) ||
          (reports[i].dkAct === 0 && reports[i].kkAct === undefined)
        ) {
          reports[i].dkTechErrorAct = message;
          bot.sendMessage(
            user,
            `Техническая ошибка активации: ${reports[i].dkTechErrorAct}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data === 'clientRejectAct') {
        if (reports[i].crossKkFact) {
          reports[i].crossKkClientReject = message;
          bot.sendMessage(
            user,
            `отказ клиента: ${reports[i].crossKkClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].crossDkFact && reports[i].crossKkFact === undefined) {
          reports[i].crossDkClientReject = message;
          bot.sendMessage(
            user,
            `отказ клиента: ${reports[i].crossDkClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Transaction && reports[i].crossDkFact === undefined) {
          reports[i].kk2TransactionClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента от совершения транзакции: ${reports[i].kk2TransactionClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Ppi && reports[i].kk2Transaction === undefined) {
          reports[i].kk2PpiClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента от подключения страховки: ${reports[i].kk2PpiClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kk2Act && reports[i].kk2Ppi === undefined) {
          reports[i].kk2ClientRejectAct = message;
          bot.sendMessage(
            user,
            `Отказ клиента от активации: ${reports[i].kk2ClientRejectAct}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkTransaction && reports[i].kk2Act === undefined) {
          reports[i].kkTransactionClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента от совершения транзакции: ${reports[i].kkTransactionClientReject}`,
            chooseStepKeyboard
          );
        }
        if (reports[i].kkPpi && reports[i].kkTransaction === undefined) {
          reports[i].kkPpiClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента от подключения страховки: ${reports[i].kkPpiClientReject}`,
            chooseStepKeyboard
          );
        }
        if (
          (reports[i].kkAct && reports[i].kkPpi === undefined) ||
          (reports[i].kkAct === 0 && reports[i].kkPpi === undefined)
        ) {
          reports[i].kkClientRejectAct = message;
          bot.sendMessage(
            user,
            `Отказ клиента от активации: ${reports[i].kkClientRejectAct}`,
            chooseStepKeyboard
          );
        }
        if (
          (reports[i].dkAct && reports[i].kkAct === undefined) ||
          (reports[i].dkAct === 0 && reports[i].kkAct === undefined)
        ) {
          reports[i].dkClientRejectAct = message;
          bot.sendMessage(
            user,
            `Отказ клиента от активации: ${reports[i].dkClientRejectAct}`,
            chooseStepKeyboard
          );
        }
        isSecondNameReport = false;
      }
      if (data == 'crossKkNameReport') {
        reports[i].crossKkNameReport = message;
        bot.sendMessage(user, `Сколько было RKO по плану`);
        isSecondNameReport = false;
      }
      if (data == 'bsNameReport') {
        reports[i].bsNameReport = message;
        bot.sendMessage(user, `Сколько было выдано селфи ДК`);
        isSecondNameReport = false;
      }
    }
  }
};
const reportFunction = (chat, user, message, userName, tgName) => {
  if (message === '/start') {
    bot.sendMessage(
      user,
      `Привет, ${userName}!\nЯ помогу тебе с вечерним отчетом\nНажми на кнопку "Меню" и выбери команду /report`
    );
  }
  //ФИКС ФАМИЛИЙ КЛИЕНТОВ, КОТОРЫЙ ОВЕР 3 ДНЯ НЕ ВЫХОДЯТ НА СВЯЗЬ
  if (message === '/report') {
    bot.sendMessage(user, `Привет, ${userName}!\nУкажи город выдачи`);
  } else {
    if (chat === user) {
      if (message !== '/start') {
        if (reports.length == 0) {
          reports.push({
            svk: userName + ' ' + tgName,
            city: message,
          });

          return bot.sendMessage(
            user,
            `Выбери дату отчета`,
            chooseDateKeyboard
          );
        } else {
          for (let i = 0; i < reports.length; i++) {
            if (reports[i].svk === userName + ' ' + tgName) {
              if (reports[i].fullName == undefined) {
                reports[i].fullName = false;
                let config = {
                  method: 'get',
                  maxBodyLength: Infinity,
                  url: `https://script.google.com/macros/s/AKfycbwLTXuujTEtALAF6HWIFS2-TQqIyOm0lhpvfXD4sKUQ4UqgF2n802kfGIWda6wlXFVkvA/exec?name=${
                    userName + ' ' + tgName
                  }`,
                  headers: {},
                };
                axios
                  .request(config)
                  .then((response) => {
                    reports[i].fullName = response.data;
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
              if (reports[i].city == undefined) {
                reports[i].city = message;
                return bot.sendMessage(
                  user,
                  `Выбери дату отчета`,
                  chooseDateKeyboard
                );
              }
              if (message / 0 === Infinity || message == 0) {
                if (reports[i].dkPlan == undefined) {
                  reports[i].dkPlan = Number(message);
                  if (reports[i].dkPlan == 0) {
                    reports[i].dkFact = 0;
                    reports[i].dkAct = 0;
                    return bot.sendMessage(user, 'Сколько было КК по плану');
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько ДК было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].dkFact == undefined) {
                  if (Number(message) <= reports[i].dkPlan) {
                    reports[i].dkFact = Number(message);
                    if (reports[i].dkFact == 0) {
                      reports[i].dkAct = 0;
                      return bot.sendMessage(user, 'Сколько было КК по плану');
                    } else {
                      if (reports[i].dkPlan === reports[i].dkFact) {
                        return bot.sendMessage(
                          user,
                          'Сколько было активированно выданых ДК'
                        );
                      } else {
                        return bot.sendMessage(
                          user,
                          `Итого не предоставленно ${
                            reports[i].dkPlan - reports[i].dkFact
                          } шт. дебетовых карт.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                          cardReasonKeyboard
                        );
                      }
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных ДК не может быть больше планового значения ДК (${reports[i].dkPlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }

                if (reports[i].dkAct == undefined) {
                  if (Number(message) <= reports[i].dkFact) {
                    reports[i].dkAct = Number(message);
                    if (reports[i].dkAct === reports[i].dkFact) {
                      return bot.sendMessage(user, 'Сколько было КК по плану');
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не активированно ${
                          reports[i].dkFact - reports[i].dkAct
                        } шт. дебетовых карт.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество активированных ДК не может быть больше фактического значения выданых ДК (${reports[i].dkFact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].kkPlan == undefined) {
                  reports[i].kkPlan = Number(message);
                  if (reports[i].kkPlan == 0) {
                    reports[i].kkFact = 0;
                    reports[i].kkAct = 0;
                    reports[i].kkPpi = 0;
                    reports[i].kkTransaction = 0;
                    return bot.sendMessage(user, 'Сколько было КК2 по плану');
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько КК было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].kkFact == undefined) {
                  if (Number(message) <= reports[i].kkPlan) {
                    reports[i].kkFact = Number(message);
                    if (reports[i].kkFact == 0) {
                      reports[i].kkAct = 0;
                      reports[i].kkPpi = 0;
                      reports[i].kkTransaction = 0;
                      return bot.sendMessage(user, 'Сколько было КК2 по плану');
                    } else {
                      if (reports[i].kkPlan === reports[i].kkFact) {
                        return bot.sendMessage(
                          user,
                          'Сколько было активированно выданых КК'
                        );
                      } else {
                        return bot.sendMessage(
                          user,
                          `Итого не предоставленно ${
                            reports[i].kkPlan - reports[i].kkFact
                          } шт. кредитных карт.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                          cardReasonKeyboard
                        );
                      }
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных КК не может быть больше планового значения КК (${reports[i].kkPlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }

                if (reports[i].kkAct == undefined) {
                  if (Number(message) <= reports[i].kkFact) {
                    reports[i].kkAct = Number(message);
                    if (reports[i].kkAct === 0) {
                      reports[i].kkTransaction = 0;
                    }
                    if (reports[i].kkAct === reports[i].kkFact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было подключено страховок к КК'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не активированно ${
                          reports[i].kkFact - reports[i].kkAct
                        } шт. кредитных карт.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество активированных КК не может быть больше фактического значения выданых КК (${reports[i].kkFact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].kkPpi == undefined) {
                  if (Number(message) <= reports[i].kkFact) {
                    reports[i].kkPpi = Number(message);
                    if (reports[i].kkPpi === reports[i].kkFact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было совершенно транзакций к выданным КК'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не подключено ${
                          reports[i].kkFact - reports[i].kkPpi
                        } шт. страховок к КК.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество подключенных страховок к КК не может быть больше фактического значения выданых КК (${reports[i].kkFact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].kkTransaction == undefined) {
                  if (Number(message) <= reports[i].kkAct) {
                    reports[i].kkTransaction = Number(message);
                    if (reports[i].kkTransaction === reports[i].kkAct) {
                      return bot.sendMessage(user, 'Сколько было КК2 по плану');
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого выполнено ${
                          reports[i].kkAct - reports[i].kkTransaction
                        } шт. транзакций по КК.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество транзакций по КК не может быть больше значения активированных КК (${reports[i].kkAct} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].kk2Plan == undefined) {
                  reports[i].kk2Plan = Number(message);
                  if (reports[i].kk2Plan == 0) {
                    reports[i].kk2Fact = 0;
                    reports[i].kk2Act = 0;
                    reports[i].kk2Ppi = 0;
                    reports[i].kk2Transaction = 0;
                    if (reports[i].kkFact + reports[i].kk2Plan > 0) {
                      return bot.sendMessage(
                        user,
                        'Сколько было выдано кросс ДК'
                      );
                    } else {
                      reports[i].crossDkPlan = 0;
                      reports[i].crossDkFact = 0;
                      return bot.sendMessage(
                        user,
                        'Сколько было предложений по кросс КК/Комбо'
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько КК2 было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].kk2Fact == undefined) {
                  if (Number(message) <= reports[i].kk2Plan) {
                    reports[i].kk2Fact = Number(message);
                    if (reports[i].kk2Fact == 0) {
                      reports[i].kk2Act = 0;
                      reports[i].kk2Ppi = 0;
                      reports[i].kk2Transaction = 0;
                      if (reports[i].kkFact + reports[i].kk2Fact > 0) {
                        return bot.sendMessage(
                          user,
                          'Сколько было выдано кросс ДК'
                        );
                      } else {
                        reports[i].crossDkPlan = 0;
                        reports[i].crossDkFact = 0;
                        return bot.sendMessage(
                          user,
                          'Сколько было предложений по кросс КК/Комбо'
                        );
                      }
                    } else {
                      if (reports[i].kk2Plan === reports[i].kk2Fact) {
                        return bot.sendMessage(
                          user,
                          'Сколько было активированно выданых КК2'
                        );
                      } else {
                        return bot.sendMessage(
                          user,
                          `Итого не предоставленно ${
                            reports[i].kk2Plan - reports[i].kk2Fact
                          } шт. КК2.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                          cardReasonKeyboard
                        );
                      }
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных КК2 не может быть больше планового значения КК2 (${reports[i].kk2Plan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }

                if (reports[i].kk2Act == undefined) {
                  if (Number(message) <= reports[i].kk2Fact) {
                    reports[i].kk2Act = Number(message);
                    if (reports[i].kk2Act === reports[i].kk2Fact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было подключено страховок к КК2'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не активированно ${
                          reports[i].kk2Fact - reports[i].kk2Act
                        } шт. КК2.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество активированных КК2 не может быть больше фактического значения выданых КК2 (${reports[i].kk2Fact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].kk2Ppi == undefined) {
                  if (Number(message) <= reports[i].kk2Fact) {
                    reports[i].kk2Ppi = Number(message);
                    if (reports[i].kk2Ppi === reports[i].kk2Fact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было совершенно транзакций к выданным КК2'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не подключено ${
                          reports[i].kk2Fact - reports[i].kk2Ppi
                        } шт. страховок к КК2.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество подключенных страховок к КК2 не может быть больше фактического значения выданых КК2 (${reports[i].kk2Fact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].kk2Transaction == undefined) {
                  if (Number(message) <= reports[i].kk2Act) {
                    reports[i].kk2Transaction = Number(message);
                    if (reports[i].kk2Transaction === reports[i].kk2Act) {
                      return bot.sendMessage(
                        user,
                        'Сколько было выдано кросс ДК'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого выполнено ${
                          reports[i].kk2Act - reports[i].kk2Transaction
                        } шт. транзакций по КК2.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество транзакций по КК2 не может быть больше значения активированных КК (${reports[i].kk2Act} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].crossDkFact == undefined) {
                  reports[i].crossDkPlan =
                    reports[i].kkFact + reports[i].kk2Fact;
                  if (Number(message) <= reports[i].crossDkPlan) {
                    reports[i].crossDkFact = Number(message);
                    if (reports[i].crossDkFact == 0) {
                      reports[i].crossDkAct = 0;
                      return bot.sendMessage(
                        user,
                        'Сколько было предложений по кросс КК/Комбо'
                      );
                    } else {
                      if (reports[i].crossDkPlan === reports[i].crossDkFact) {
                        return bot.sendMessage(
                          user,
                          'Сколько было активированно выданных кросс ДК'
                        );
                      } else {
                        return bot.sendMessage(
                          user,
                          `Итого не предоставленно ${
                            reports[i].crossDkPlan - reports[i].crossDkFact
                          } шт. кросс ДК.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                          activReasonKeyboard
                        );
                      }
                    }
                  }
                }

                if (reports[i].crossDkAct == undefined) {
                  if (Number(message) <= reports[i].crossDkFact) {
                    reports[i].crossDkAct = Number(message);
                    if (reports[i].crossDkAct === reports[i].crossDkFact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было предложений по кросс КК/Комбо'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не активированно ${
                          reports[i].crossDkFact - reports[i].crossDkAct
                        } шт. Кросс ДК.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество активированных кросс ДК не может быть больше суммы фактических выдач КК и КК2 (${reports[i].crossDkPlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].offerKk == undefined) {
                  reports[i].offerKk = Number(message);
                  if (reports[i].offerKk == 0) {
                    reports[i].crossKkFact = 0;
                    return bot.sendMessage(user, 'Сколько было RKO по плану');
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько из них было фактически выдано'
                    );
                  }
                }

                if (reports[i].crossKkFact === undefined) {
                  if (Number(message) <= reports[i].offerKk) {
                    reports[i].crossKkFact = Number(message);
                    reports[i].refusalOfferKK =
                      reports[i].offerKk - reports[i].crossKkFact;
                    if (reports[i].offerKk === reports[i].crossKkFact) {
                      isSecondNameReport = true;
                      data = 'crossKkNameReport';
                      return bot.sendMessage(
                        user,
                        `Напиши через пробел фамилии клиентов, которым предоставлено кросс КК/Комбо и лимит на карте. В формате: Иванов 100 000 Петров 28 000`
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не предоставленно ${reports[i].refusalOfferKK} шт. Кросс КК/Комбо.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество кросс КК не может быть больше количества предложений по кросс КК (${reports[i].offerKk} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].rkoPlan == undefined) {
                  reports[i].rkoPlan = Number(message);
                  if (reports[i].rkoPlan == 0) {
                    reports[i].rkoFact = 0;
                    return bot.sendMessage(user, 'Сколько было ZPC по плану');
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько RKO было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].rkoFact == undefined) {
                  if (Number(message) <= reports[i].rkoPlan) {
                    reports[i].rkoFact = Number(message);
                    if (reports[i].rkoPlan === reports[i].rkoFact) {
                      return bot.sendMessage(user, 'Сколько было ZPC по плану');
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не предоставленно ${
                          reports[i].rkoPlan - reports[i].rkoFact
                        } шт. RKO.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        cardReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных RKO не может быть больше планового значения RKO (${reports[i].rkoPlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].zpcPlan == undefined) {
                  reports[i].zpcPlan = Number(message);
                  if (reports[i].zpcPlan == 0) {
                    reports[i].zpcFact = 0;
                    reports[i].zpcAct = 0;
                    return bot.sendMessage(
                      user,
                      'Были ли сегодня в плане такие продукты как: Re, PIL, CL, Ипотека',
                      booleanKeyboard
                    );
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько ZPC было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].zpcFact == undefined) {
                  if (Number(message) <= reports[i].zpcPlan) {
                    reports[i].zpcFact = Number(message);
                    if (reports[i].zpcPlan === reports[i].zpcFact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было активированно выданых ZPC'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не предоставленно ${
                          reports[i].zpcPlan - reports[i].zpcFact
                        } шт. ZPC.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        cardReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных ZPC не может быть больше планового значения ZPC (${reports[i].zpcPlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }

                if (reports[i].zpcAct == undefined) {
                  if (Number(message) <= reports[i].zpcFact) {
                    reports[i].zpcAct = Number(message);
                    if (reports[i].zpcAct === reports[i].zpcFact) {
                      return bot.sendMessage(
                        user,
                        'Были ли сегодня в плане такие продукты как: Re, PIL, CL, Ипотека',
                        booleanKeyboard
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не активированно ${
                          reports[i].zpcFact - reports[i].zpcAct
                        } шт. ZPC.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество активированных ZPC не может быть больше фактического значения выданых ZPC (${reports[i].zpcFact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].rePlan == undefined) {
                  reports[i].rePlan = Number(message);
                  if (reports[i].rePlan == 0) {
                    reports[i].reFact = 0;
                    reports[i].reAct = 0;
                    return bot.sendMessage(user, 'Сколько было PIL по плану');
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько Re было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].reFact == undefined) {
                  if (Number(message) <= reports[i].rePlan) {
                    reports[i].reFact = Number(message);
                    if (reports[i].rePlan === reports[i].reFact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было активированно выданых Re'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не предоставленно ${
                          reports[i].rePlan - reports[i].reFact
                        } шт. Re.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        cardReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных Re не может быть больше планового значения Re (${reports[i].rePlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }

                if (reports[i].reAct == undefined) {
                  if (Number(message) <= reports[i].reFact) {
                    reports[i].reAct = Number(message);
                    if (reports[i].reAct === reports[i].reFact) {
                      return bot.sendMessage(user, 'Сколько было PIL по плану');
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не активированно ${
                          reports[i].reFact - reports[i].reAct
                        } шт. Re.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество активированных Re не может быть больше фактического значения выданых Re (${reports[i].reFact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].pilPlan == undefined) {
                  reports[i].pilPlan = Number(message);
                  if (reports[i].pilPlan == 0) {
                    reports[i].pilFact = 0;
                    reports[i].pilPpi = 0;
                    return bot.sendMessage(user, 'Сколько было CL по плану');
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько PIL было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].pilFact == undefined) {
                  if (Number(message) <= reports[i].pilPlan) {
                    reports[i].pilFact = Number(message);
                    if (reports[i].pilPlan === reports[i].pilFact) {
                      return bot.sendMessage(
                        user,
                        'Сколько было подключенно страховок к PIL'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не предоставленно ${
                          reports[i].pilPlan - reports[i].pilFact
                        } шт. PIL.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        cardReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных PIL не может быть больше планового значения PIL (${reports[i].pilPlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].pilPpi == undefined) {
                  if (Number(message) <= reports[i].pilFact) {
                    reports[i].pilPpi = Number(message);
                    if (reports[i].pilPpi === reports[i].pilFact) {
                      return bot.sendMessage(user, 'Сколько было CL по плану');
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не подключено ${
                          reports[i].pilFact - reports[i].pilPpi
                        } шт. страховок к PIL.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        activReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество подключенных страховок не может быть больше фактического значения выданых PIL (${reports[i].pilFact} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }
                if (reports[i].clPlan == undefined) {
                  reports[i].clPlan = Number(message);
                  if (reports[i].clPlan == 0) {
                    reports[i].clFact = 0;
                    return bot.sendMessage(
                      user,
                      'Сколько было открыто БС с покупкой акций'
                    );
                  } else {
                    return bot.sendMessage(
                      user,
                      'Сколько Cl было фактически предоставленно'
                    );
                  }
                }

                if (reports[i].clFact == undefined) {
                  if (Number(message) <= reports[i].clPlan) {
                    reports[i].clFact = Number(message);
                    if (reports[i].clFact === reports[i].clPlan) {
                      return bot.sendMessage(
                        user,
                        'Сколько было открыто БС с покупкой акций'
                      );
                    } else {
                      return bot.sendMessage(
                        user,
                        `Итого не предоставленно ${
                          reports[i].clPlan - reports[i].clFact
                        } шт. Cl.\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
                        cardReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных Сl не может быть больше планового значения Re (${reports[i].clPlan} шт.)\nВведите верное значение ещё раз`
                    );
                  }
                }

                if (reports[i].bs == undefined) {
                  reports[i].bs = Number(message);
                  if (reports[i].bs == 0) {
                    return bot.sendMessage(
                      user,
                      `Сколько всего было предложений по Кросс КК или Комбо`
                    );
                  } else {
                    isSecondNameReport = true;
                    data = 'bsNameReport';
                    return bot.sendMessage(
                      user,
                      `Напиши через пробел фамилии клиентов, которым был открыт БС и у которых куплены акции`
                    );
                  }
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
                    return bot.sendMessage(
                      user,
                      'Сколько было всего сделано ЦП'
                    );
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество установок приложения на айфон не может быть больше общего количества айфонов (${reports[i].iphone} шт.)\nВведите верное значение ещё раз`
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
                    `Подтвердите данные перед отправкой\n\nБС ${reports[i].bs}\nПокупок акций ${reports[i].stock}\nПредложений по кросс КК ${reports[i].offerKk}\nКросс КК ${reports[i].crossKkFact}\nКросс ДК ${reports[i].crossDK}\nСелфи ДК ${reports[i].selfieDK}\nСелфи КК ${reports[i].selfieKK}\nАйфонов ${reports[i].iphone}\nУстановок приложения ${reports[i].ios}\nЦП ${reports[i].cp}`,
                    booleanKeyboard
                  );
                }
              } else {
                bot.sendMessage(
                  user,
                  'Ответ должен содержать числовое значение'
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

  console.log(reports);
  console.log(data);
  !isSecondNameReport
    ? reportFunction(chat, user, message, userName, tgName)
    : secondNameReport(chat, user, message, userName, tgName);
});
bot.on('callback_query', (msg) => {
  console.log(reports);
  console.log(data);
  const user = msg.from.id;
  const crossKkNameReportFn = () => {
    isSecondNameReport = true;
    data = 'crossKkNameReport';
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, которым предоставлено кросс КК/Комбо и лимит на карте. В формате: Иванов 100 000 Петров 28 000'
    );
  };
  const userName = msg.from.first_name;
  const tgName = msg.from.username;
  data = msg.data;
  let report = reports.find((el) => el.svk == userName + ' ' + tgName);
  let deleteIndex = reports.indexOf(report);
  if (data === 'true') {
    if (report.cp === undefined) {
      bot.sendMessage(user, 'Сколько было Re по плану');
    } else {
      const googleData = new Config(report);
      let bonus =
        report.stock * 600 + // ПЕРЕПИСАТЬ С ДОБАВЛЕНИЕМ ДК и пр
        report.crossKkFact * 470 +
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
    }
  }
  if (data == 'today' || data == 'yesterday') {
    report.date =
      data === 'today' ? todayDate : data === 'yesterday' ? yesterdayDate : {};

    bot.sendMessage(user, 'Сколько было ДК по плану');
  }
  if (data === 'false') {
    if (report.cp === undefined) {
      report.rePlan = 0;
      report.reFact = 0;
      report.reAct = 0;
      report.pilPlan = 0;
      report.pilFact = 0;
      report.pilPpi = 0;
      report.clPlan = 0;
      report.clFact = 0;
      report.mortgagePlan = 0;
      report.mortgageFact = 0;
      bot.sendMessage(user, 'Сколько было сделок по покупке акций');
    } else {
      reports.splice(deleteIndex, 1);
      bot.sendMessage(
        user,
        'Необходимо заново внести все данные\nCколько сегодня было ДК по плану'
      );
    }
  }

  if (data === 'chooseOfReason') {
    //ТУТ ВНИМАТЕЛЬНО
    //НУЖНО ОПРЕДЕЛИТЬ ВЕРНЫЕ УСЛОВИЯ ДЛЯ ПОЯВЛЕНИЯ СООТВЕТСТВУЮЩИХ СООБЩЕНИЙ
    // возможность вывода списка уже внесенных фамилий, через цикл по ключам где undefined

    if (report.crossKkFact) {
      if (report.crossKkTechError || report.crossKkClientReject) {
        bot.sendMessage(
          user,
          `Итого не предоставлено ${
            report.offerKk - report.crossKkFact
          } шт. кросс КК/Комбо\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
        isSecondNameReport = true;
      }
    }
    if (report.crossDkFact && report.crossKkFact === undefined) {
      if (report.crossDkTechError || report.crossDkClientReject) {
        bot.sendMessage(
          user,
          `Итого не предоставлено ${
            report.crossDkPlan - report.crossDkFact
          } шт. кросс ДК\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
        isSecondNameReport = true;
      }
    }

    if (report.kk2Transaction && report.crossDkFact === undefined) {
      if (report.kk2TransactionTechError || report.kk2TransactionClientReject) {
        bot.sendMessage(
          user,
          `Итого совершенно  ${
            report.kk2Act - report.kk2Transaction
          } шт. транзакций к КК\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
      }
      isSecondNameReport = true;
    }
    if (report.kk2Ppi && report.kk2Transaction === undefined) {
      if (report.kk2PpiTechError || report.kk2PpiClientReject) {
        bot.sendMessage(
          user,
          `Итого подключено  ${
            report.kk2Fact - report.kk2Ppi
          } шт. страховок к КК2\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
      }
      isSecondNameReport = true;
    }
    if (report.kk2Fact && report.kk2Ppi === undefined) {
      if (report.kk2TechErrorAct || report.kk2ClientRejectAct) {
        bot.sendMessage(
          user,
          `Итого не активированно ${
            report.kk2Fact - report.kk2Act
          } шт. КК2\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
      } else {
        bot.sendMessage(
          user,
          `Итого не предоставлено ${
            report.kk2Plan - report.kk2Fact
          } шт. КК2\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          cardReasonKeyboard
        );
      }
      isSecondNameReport = true;
    }

    if (report.kkTransaction && report.kk2Fact === undefined) {
      if (report.kkTransactionTechError || report.kkTransactionClientReject) {
        bot.sendMessage(
          user,
          `Итого совершенно  ${
            report.kkAct - report.kkTransaction
          } шт. транзакций к КК\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
      }
      isSecondNameReport = true;
    }
    if (report.kkPpi && report.kkTransaction === undefined) {
      if (report.kkPpiTechError || report.kkPpiClientReject) {
        bot.sendMessage(
          user,
          `Итого подключено  ${
            report.kkFact - report.kkPpi
          } шт. страховок к КК\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
      }
      isSecondNameReport = true;
    }
    if (report.kkFact && report.kkPpi === undefined) {
      if (report.kkTechErrorAct || report.kkClientRejectAct) {
        bot.sendMessage(
          user,
          `Итого не активированно ${
            report.kkFact - report.kkAct
          } шт. кредитных карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
      } else {
        bot.sendMessage(
          user,
          `Итого не предоставлено ${
            report.kkPlan - report.kkFact
          } шт. кредитных карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          cardReasonKeyboard
        );
      }
      isSecondNameReport = true;
    }
    if (report.dkFact && report.kkFact === undefined) {
      if (report.dkTechErrorAct || report.dkClientRejectAct) {
        bot.sendMessage(
          user,
          `Итого не активированно ${
            report.dkFact - report.dkAct
          } шт. дебетовых карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
      } else {
        bot.sendMessage(
          user,
          `Итого не предоставлено ${
            report.dkPlan - report.dkFact
          } шт. дебетовых карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          cardReasonKeyboard
        );
      }
      isSecondNameReport = true;
    }
  }
  if (data === 'continueReport') {
    report.dkAct === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых ДК')
      : report.kkPlan === undefined
      ? bot.sendMessage(user, 'Сколько было КК по плану')
      : report.kkAct === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых КК')
      : report.kkPpi === undefined
      ? bot.sendMessage(user, 'Сколько было подключено страховок к КК')
      : report.kkTransaction === undefined
      ? bot.sendMessage(user, 'Сколько было совершенно транзакций по КК')
      : report.kk2Plan === undefined
      ? bot.sendMessage(user, 'Сколько было КК2 по плану')
      : report.kk2Act === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых КК2')
      : report.kk2Ppi === undefined
      ? bot.sendMessage(user, 'Сколько было подключено страховок к КК2')
      : report.kk2Transaction === undefined
      ? bot.sendMessage(user, 'Сколько было совершенно транзакций по КК2')
      : report.crossDkFact === undefined
      ? bot.sendMessage(user, 'Сколько было предоставлено кросс ДК')
      : report.crossDkAct === undefined
      ? bot.sendMessage(user, 'Сколько кросс ДК активированно')
      : report.offerKk === undefined
      ? bot.sendMessage(user, 'Сколько было предложений по кросс КК/Комбо')
      : report.crossKkNameReport === undefined
      ? crossKkNameReportFn()
      : report.rkoPlan === undefined
      ? bot.sendMessage(user, 'Сколько было RKO по плану')
      : report.zpcPlan === undefined
      ? bot.sendMessage(user, 'Сколько было ZPC по плану')
      : report.zpcAct === undefined
      ? bot.sendMessage(user, 'Сколько ZPC было активированно')
      : report.dkT0 === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых Т0 ДК')
      : report.kkT0 === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых Т0 КК')
      : report.kk2T0 === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых Т0 КК2')
      : {};
  }

  if (data === '1') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, которые не ответили на звонок'
    );
    isSecondNameReport = true;
  }

  if (data === '2') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, которые перенесли встречу на другой день\nНапример\nИванов 02.04 Петров 04.04 Сидоров 04.04'
    );
    isSecondNameReport = true;
  }
  if (data === '3') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, у которых номер неверный/недоступен/автоответчик'
    );
    isSecondNameReport = true;
  }
  if (data === '4') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, у которых произошла отмена заявки по сроку'
    );
    isSecondNameReport = true;
  }
  if (data === '5') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, у которых в момент встречи произошла техническая ошбика'
    );
    isSecondNameReport = true;
  }
  if (data === '6') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, у которых на момент встречи отсутствовал/испорчен паспорт'
    );
    isSecondNameReport = true;
  }
  if (data === '7') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, которым Банк отказал в предоставлении продукта'
    );
    isSecondNameReport = true;
  }
  if (data === '8') {
    bot.sendMessage(
      user,
      'Напиши через пробел фамилии клиентов, которые отказались от получения прокута Банка'
    );
    isSecondNameReport = true;
  }
  if (data === 'technicalErrorAct') {
    if (report.crossKkAct) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которые не активировали кросс КК/Комбо из-за технической ошибки'
      );
    }
    if (report.crossKkFact && report.crossKkAct === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которым не предоставленна кросс КК/Комбо из-за технической ошибки'
      );
      isSecondNameReport = true;
    }
    if (report.crossDkAct && report.crossKkFact === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которые не активировали кросс ДК из-за технической ошибки'
      );
    }
    if (report.crossDkFact && report.crossDkAct === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которым не предоставленна кросс ДК из-за технической ошибки'
      );
    }
    if (report.kk2Transaction && report.crossDkFact === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которые не произвели транзакцию по КК2 из-за тех. ошибки'
      );
    }
    if (report.kk2Ppi && report.kk2Transaction === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которым не подключена страховка к КК2 из-за тех. ошибки'
      );
    }
    if (report.kkTransaction && report.kk2Ppi === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которые не произвели транзакцию по КК из-за тех. ошибки'
      );
    }
    if (report.kkPpi && report.kkTransaction === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которым не подключена страховка к КК из-за тех. ошибки'
      );
    }
    if (
      (report.dkAct === 0 && report.kkFact == undefined) ||
      (report.dkAct && report.kkFact == undefined) ||
      (report.kkAct && report.kk2Fact == undefined) ||
      (report.kk2Act && report.crossDkPlan == undefined) ||
      (report.crossDkAct && report.crossKkFact == undefined) ||
      (report.crossKkAct && report.pilPpi == undefined)
    ) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которые не активировали карту из-за тех. ошибки'
      );
    }
    isSecondNameReport = true;
  }
  if (data === 'clientRejectAct') {
    if (report.crossKkAct) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которыe отказались от активации кросс КК'
      );
    }
    if (report.crossKkFact && report.crossKkAct === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которыe отказались от выдачи кросс КК/Комбо'
      );
    }
    if (report.crossDkAct && report.crossKkFact === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которые отказались от активировации кросс ДК'
      );
    }
    if (report.crossDkFact && report.crossDkAct === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которыe отказались от выдачи кросс ДК'
      );
    }
    if (report.crossDkFact === undefined) {
      bot.sendMessage(
        user,
        'Напиши фамилию/фамилии клиента/клиентов, которые отказались от активировации карты'
      );
    }
    isSecondNameReport = true;
  }
});

// CL
// Ипотека
// Т0

// ЦП
// Селфи
// БС
// Сделка
// Айфон план/факт
//clientRejectAct прописать ccppi cctransaction cc2
