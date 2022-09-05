import '../lib/core/core.js'
import { handleInstalled } from '../lib/core/tools.js'
import { initServices } from './services.js'

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

initServices()
