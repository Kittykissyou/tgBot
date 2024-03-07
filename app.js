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
      [{ text: 'Всё верно', callback_data: 'true' }],
      [{ text: 'Изменить', callback_data: 'false' }],
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
        if (reports[i].kkFact) {
          reports[i].kkMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].kkMissedCall}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkMissedCall = message;
          bot.sendMessage(
            user,
            `Клиент не отвечает: ${reports[i].dkMissedCall}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === '2') {
        if (reports[i].kkFact) {
          reports[i].kkTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].kkTransfer}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkTransfer = message;
          bot.sendMessage(
            user,
            `Перенос: ${reports[i].dkTransfer}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === '3') {
        if (reports[i].kkFact) {
          reports[i].kkUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].kkUnavailable}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkUnavailable = message;
          bot.sendMessage(
            user,
            `Номер неверный/недоступен/автоответчик: ${reports[i].dkUnavailable}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === '4') {
        if (reports[i].kkFact) {
          reports[i].kkDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].kkDeadlineCancel}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkDeadlineCancel = message;
          bot.sendMessage(
            user,
            `Отмена по сроку: ${reports[i].dkDeadlineCancel}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === '5') {
        if (reports[i].kkFact) {
          reports[i].kkTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].kkTecError}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkTecError = message;
          bot.sendMessage(
            user,
            `Техническая ошибка выдачи: ${reports[i].dkTecError}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === '6') {
        if (reports[i].kkFact) {
          reports[i].kkDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: : ${reports[i].kkDocReject}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkDocReject = message;
          bot.sendMessage(
            user,
            `Отсутствует/Испорчен паспорт: ${reports[i].dkDocReject}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === '7') {
        if (reports[i].kkFact) {
          reports[i].kkBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].kkBankReject}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkBankReject = message;
          bot.sendMessage(
            user,
            `Отказ Банка: ${reports[i].dkBankReject}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === '8') {
        if (reports[i].kkFact) {
          reports[i].kkClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].kkClientReject}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkClientReject = message;
          bot.sendMessage(
            user,
            `Отказ клиента: ${reports[i].dkClientReject}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === 'technicalErrorAct') {
        if (reports[i].kkAct) {
          reports[i].kkTechErrorAct = message;
          bot.sendMessage(
            user,
            `Техническая ошибка активации: ${reports[i].kkTechErrorAct}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkTechErrorAct = message;
          bot.sendMessage(
            user,
            `Техническая ошибка активации: ${reports[i].dkTechErrorAct}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
      }
      if (data === 'clientRejectAct') {
        if (reports[i].kkAct) {
          reports[i].kkClientRejectAct = message;
          bot.sendMessage(
            user,
            `Техническая ошибка активации: ${reports[i].kkTechErrorAct}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        } else {
          reports[i].dkClientRejectAct = message;
          bot.sendMessage(
            user,
            `Отказ клиента от активации: ${reports[i].dkClientRejectAct}`,
            chooseStepKeyboard
          );
          isSecondNameReport = false;
        }
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
                  return bot.sendMessage(
                    user,
                    'Сколько ДК было фактически предоставленно'
                  );
                }

                if (reports[i].dkFact == undefined) {
                  if (Number(message) <= reports[i].dkPlan) {
                    reports[i].dkFact = Number(message);
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
                  return bot.sendMessage(
                    user,
                    'Сколько КК было фактически предоставленно'
                  );
                }

                if (reports[i].kkFact == undefined) {
                  if (Number(message) <= reports[i].kkPlan) {
                    reports[i].kkFact = Number(message);
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
                    if (reports[i].kkAct === reports[i].kkFact) {
                      return bot.sendMessage(user, 'Сколько было КК2 по плану');
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
                if (reports[i].kk2Plan == undefined) {
                  reports[i].kk2Plan = Number(message);
                  return bot.sendMessage(
                    user,
                    'Сколько КК2 было фактически предоставленно'
                  );
                }

                if (reports[i].kk2Fact == undefined) {
                  if (Number(message) <= reports[i].kk2Plan) {
                    reports[i].kk2Fact = Number(message);
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
                        'Сколько было выдано кросс ДК'
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

                if (reports[i].crossDkFact == undefined) {
                  reports[i].crossDkPlan =
                    reports[i].kkFact + reports[i].kk2Fact;
                  if (Number(message) <= reports[i].crossDkPlan) {
                    reports[i].crossDkFact = Number(message);
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
                        cardReasonKeyboard
                      );
                    }
                  } else {
                    return bot.sendMessage(
                      user,
                      `Количество предоставленных кросс ДК не может быть больше суммы фактических значения КК и КК2 (${reports[i].crossDkPlan} шт.)\nВведите верное значение ещё раз`
                    );
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
                // Крос ДК к КК
                // Кросс ДК к КК2
                // Комбо/кросс КК
                // ЦП
                // Селфи
                // БС
                // Сделка
                // Айфон план/факт

                if (reports[i].bs == undefined) {
                  reports[i].bs = Number(message);
                  if (reports[i].bs == 0) {
                    reports[i].stock = 0;
                    return bot.sendMessage(
                      user,
                      `Сколько всего было предложений по Кросс КК или Комбо`
                    );
                  } else {
                    return bot.sendMessage(
                      user,
                      `Сколько было покупок акций с клиентом на бирже`
                    );
                  }
                }

                if (reports[i].stock == undefined) {
                  if (Number(message) <= reports[i].bs) {
                    reports[i].stock = Number(message);
                    return bot.sendMessage(
                      user,
                      `Сколько всего было предложений по Кросс КК или Комбо к основной выдаче ДК`
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
                      `Количество кросс КК не может быть больше количества предложений по кросс КК (${reports[i].offerKK} шт.)\nВведите верное значение ещё раз`
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
                    `Подтвердите данные перед отправкой\n\nБС ${reports[i].bs}\nПокупок акций ${reports[i].stock}\nПредложений по кросс КК ${reports[i].offerKK}\nКросс КК ${reports[i].crossKK}\nКросс ДК ${reports[i].crossDK}\nСелфи ДК ${reports[i].selfieDK}\nСелфи КК ${reports[i].selfieKK}\nАйфонов ${reports[i].iphone}\nУстановок приложения ${reports[i].ios}\nЦП ${reports[i].cp}`,
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
  const userName = msg.from.first_name;
  const tgName = msg.from.username;
  data = msg.data;
  let report = reports.find((el) => el.svk == userName + ' ' + tgName);
  let deleteIndex = reports.indexOf(report);
  if (data === 'true') {
    const googleData = new Config(report);
    let bonus =
      report.stock * 600 + // ПЕРЕПИСАТЬ С ДОБАВЛЕНИЕМ ДК и пр
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
  }
  if (data == 'today' || data == 'yesterday') {
    report.date =
      data === 'today' ? todayDate : data === 'yesterday' ? yesterdayDate : {};

    bot.sendMessage(user, 'Сколько было ДК по плану');
  }
  if (data === 'false') {
    reports.splice(deleteIndex, 1);
    bot.sendMessage(
      user,
      'Необходимо заново внести все данные\nCколько сегодня было ДК по плану'
    );
  }

  if (data === 'chooseOfReason') {
    //ТУТ ВНИМАТЕЛЬНО
    //НУЖНО ОПРЕДЕЛИТЬ ВЕРНЫЕ УСЛОВИЯ ДЛЯ ПОЯВЛЕНИЯ СООТВЕТСТВУЮЩИХ СООБЩЕНИЙ
    // возможность вывода списка уже внесенных фамилий, через цикл по ключам где undefined
    if (report.kkFact === undefined) {
      if (report.dkTechErrorAct || report.dkClientRejectAct) {
        bot.sendMessage(
          user,
          `Итого не активированно ${
            report.dkFact - report.dkAct
          } шт. дебетовых карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
        isSecondNameReport = true;
      } else {
        bot.sendMessage(
          user,
          `Итого не предоставлено ${
            report.dkPlan - report.dkFact
          } шт. дебетовых карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          cardReasonKeyboard
        );
        isSecondNameReport = true;
      }
    }
    if (report.kkFact && report.kk2Fact === undefined) {
      if (report.kkTechErrorAct || report.kkClientRejectAct) {
        bot.sendMessage(
          user,
          `Итого не активированно ${
            report.kkFact - report.kkAct
          } шт. кредитных карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          activReasonKeyboard
        );
        isSecondNameReport = true;
      } else {
        bot.sendMessage(
          user,
          `Итого не предоставлено ${
            report.kkPlan - report.kkFact
          } шт. кредитных карт\nВыбери одну из предложенных категорий причин для внесений фамилий клиента`,
          cardReasonKeyboard
        );
        isSecondNameReport = true;
      }
    }
  }
  if (data === 'continueReport') {
    report.dkAct === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых ДК')
      : report.kkPlan === undefined
      ? bot.sendMessage(user, 'Сколько было КК по плану')
      : report.kkAct === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых КК')
      : report.kk2Plan === undefined
      ? bot.sendMessage(user, 'Сколько было КК2 по плану')
      : report.kk2Act === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых КК2')
      : report.dkT0 === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых Т0 ДК')
      : report.kkT0 === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых Т0 КК')
      : report.kk2T0 === undefined
      ? bot.sendMessage(user, 'Сколько было активированно выданых Т0 КК2')
      : {};
  }

  if (data === '1') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, который ответил на звонок'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, которые не ответили на звонок'
        );
    isSecondNameReport = true;
  }

  if (data === '2') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, который перенес встречу на другой день\nНапример, Иванов 02.04'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, которые перенесли встречу на другой день\nНапример\nИванов 02.04 Петров 04.04 Сидоров 04.04'
        );
    isSecondNameReport = true;
  }
  if (data === '3') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, у которого номер неверный/недоступен/автоответчик'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, у которых номер неверный/недоступен/автоответчик'
        );
    isSecondNameReport = true;
  }
  if (data === '4') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, у которого произошла отмена заявки по сроку'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, у которых произошла отмена заявки по сроку'
        );
    isSecondNameReport = true;
  }
  if (data === '5') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, у которого в момент встречи произошла техническая ошбика'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, у которых в момент встречи произошла техническая ошбика'
        );
    isSecondNameReport = true;
  }
  if (data === '6') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, у которого на момент встречи отсутствовал/испорчен паспорт'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, у которых на момент встречи отсутствовал/испорчен паспорт'
        );
    isSecondNameReport = true;
  }
  if (data === '7') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, которому Банк отказал в предоставлении продукта'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, которым Банк отказал в предоставлении продукта'
        );
    isSecondNameReport = true;
  }
  if (data === '8') {
    report.dkPlan - report.dkFact === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, который отказался от получения продукта Банка'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, которые отказались от получения прокута Банка'
        );
    isSecondNameReport = true;
  }
  if (data === 'technicalErrorAct') {
    report.dkFact - report.dkAct === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, который не активировал карту из-за тех. ошибка'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, которые не активировали карту из-за тех. ошибки'
        );
    isSecondNameReport = true;
  }
  if (data === 'clientRejectAct') {
    report.dkFact - report.dkAct === 1
      ? bot.sendMessage(
          user,
          'Напиши фамилию клиента, который отказался от активации карты'
        )
      : bot.sendMessage(
          user,
          'Напиши через пробел фамилии клиентов, которые отказались от активации карты'
        );
    isSecondNameReport = true;
  }
});
