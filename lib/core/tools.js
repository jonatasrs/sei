import { currentBrowser } from '../lib/core/core.js';
/******************************************************************************
 * Executa ao instalar ou atualizar o complemento.                           *
 ******************************************************************************/
export function handleInstalled (details) {
  function onError (error) { console.error(`Error: ${error}`) }
  function AbrirUrlSeipp (item) {
    // Ao instalar ou atualizar.
    item.InstallOrUpdate = true
    currentBrowser.storage.local.set(item)

    if (item.CheckTypes === undefined) {
      currentBrowser.tabs.create({ url: 'https://jonatasrs.github.io/sei/' })
    } else if (item.CheckTypes.indexOf('hidemsgupdate') === -1) {
      currentBrowser.tabs.create({ url: 'https://jonatasrs.github.io/sei/' })
    }
  }

  getLocalStorage('CheckTypes').then(AbrirUrlSeipp).catch(onError)
}

export function getLocalStorage (params) {
  return new Promise((resolve, reject) => {
    currentBrowser.storage.local.get(params, (storage) => {
      if (currentBrowser.runtime.lastError) {
        reject(currentBrowser.runtime.lastError)
      }
      resolve(storage)
    })
  })
}

export function getAlarms (name) {
  return new Promise((resolve, reject) => {
    currentBrowser.alarms.get(name, alarm => {
      if (currentBrowser.runtime.lastError) {
        reject(currentBrowser.runtime.lastError)
      }
      resolve(alarm)
    })
  })
}

export function clearAlarm (name) {
  return new Promise((resolve, reject) => {
    currentBrowser.alarms.clear(name, wasCleared => {
      if (currentBrowser.runtime.lastError) {
        reject(currentBrowser.runtime.lastError)
      }
      resolve(wasCleared)
    })
  })
}

export function browserActionGetBadgeText (details) {
  return new Promise((resolve, reject) => {
    currentBrowser.browserAction.getBadgeText(details, badgeText => {
      if (currentBrowser.runtime.lastError) {
        reject(currentBrowser.runtime.lastError)
      }
      resolve(badgeText)
    })
  })
}
