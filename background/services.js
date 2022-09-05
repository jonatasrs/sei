import { notifyOnClicked, notifyReceivedMenssage, serviceNotify } from './notifyProcessos.js'

export async function initServices () {
  serviceNotify()
}

/** Handle de mensagens recebidas */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === 'browserAction') {
    notifyReceivedMenssage(message)
  } else if (message.from === 'seippOptionsSave') {
    notifyReceivedMenssage(message)
  }
})

/** Handle de click nas notificações */
browser.notifications.onClicked.addListener(function (notificationId) {
  if (notificationId === 'notifyProcessos') {
    notifyOnClicked()
  }
})
