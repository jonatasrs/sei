/******************************************************************************
 * Executa ao instalar ou atualizar o complemento.                           *
 ******************************************************************************/
export function handleInstalled (details) {
  function onError (error) { console.error(`Error: ${error}`) }
  function AbrirUrlSeipp (item) {
    // Ao instalar ou atualizar.
    item.InstallOrUpdate = true
    browser.storage.local.set(item)

    if (item.CheckTypes === undefined) {
      browser.tabs.create({ url: 'https://jonatasrs.github.io/sei/' })
    } else if (item.CheckTypes.indexOf('hidemsgupdate') === -1) {
      browser.tabs.create({ url: 'https://jonatasrs.github.io/sei/' })
    }
  }

  getLocalStorage('CheckTypes').then(AbrirUrlSeipp).catch(onError)
}

export function getLocalStorage (params) {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(params, (storage) => {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError)
      }
      resolve(storage)
    })
  })
}

export function getAlarms (name) {
  return new Promise((resolve, reject) => {
    browser.alarms.get(name, alarm => {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError)
      }
      resolve(alarm)
    })
  })
}

export function clearAlarm (name) {
  return new Promise((resolve, reject) => {
    browser.alarms.clear(name, wasCleared => {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError)
      }
      resolve(wasCleared)
    })
  })
}

export function browserActionGetBadgeText (details) {
  return new Promise((resolve, reject) => {
    browser.browserAction.getBadgeText(details, badgeText => {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError)
      }
      resolve(badgeText)
    })
  })
}
