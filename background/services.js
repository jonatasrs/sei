import { notifyOnClicked, notifyReceivedMenssage, serviceNotify } from './notifyProcessos.js'
import { currentBrowser } from '../lib/core/core.js'

export async function initServices () {
  serviceNotify()
}

/** Handle de mensagens recebidas */
currentBrowser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === 'browserAction') {
    notifyReceivedMenssage(message)
  } else if (message.from === 'seippOptionsSave') {
    notifyReceivedMenssage(message)
  }
})

/** Handle de click nas notificações */
currentBrowser.notifications.onClicked.addListener(function (notificationId) {
  if (notificationId === 'notifyProcessos') {
    notifyOnClicked()
  }
});
