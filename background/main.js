import '../lib/core.js'
import { handleInstalled } from './tools.js'
import { storageServices, initServices } from './services.js'

/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/

browser.runtime.onInstalled.addListener(handleInstalled)

if (!window.isChrome) {
  browser.runtime.getBrowserInfo().then(function (info) {
    browser.storage.local.set({ version: info.version }).then(null, null)
  })
}

browser.notifications.onClicked.addListener(function (notificationId) {
  console.log('Notificação ' + notificationId + ' onClickd')
})

initServices()
browser.storage.onChanged.addListener(storageServices)
