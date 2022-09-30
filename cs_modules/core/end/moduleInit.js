/* global seiVersionCompare, seiVersion */

async function ModuleInit (BaseName, PageReload = false) {
  try {
    const storageData = await getLocalStorage()
    const defaultOptions = await loadDefaultOptions(storageData)

    const ModName = CompName + '.' + BaseName
    const IsModExec = $("head meta[name='" + ModName + "'").attr('value')

    if (seiVersionCompare('<', '3')) {
      console.log(`[${CompName} ${Date.now()}] ${BaseName} Versão incompatível do SEI. (${seiVersion})`)
      throw new Error('Versão incompatível do SEI')
    }
    if (IsModExec !== 'true') {
      $('head').append("<meta name='" + ModName + "' value='true'>")
      console.log('[' + CompName + ' ' + Date.now() + ']' + BaseName)
      return defaultOptions
    } else if (IsModExec === 'true' && PageReload) {
      window.location.assign(window.location.href)
      console.log('[' + CompName + ' ' + Date.now() + ']' + BaseName + 'Reload page')
      throw new Error('Reload page')
    } else {
      throw new Error('Not init')
    }
  } catch (error) {
    const errorMsg = `[${CompName} ${Date.now()}] ${BaseName} ERRO: (${error})`
    throw new Error(errorMsg)
  }
}

async function loadDefaultOptions (storageData) {
  SavedOptions = { ...SavedOptions, ...storageData }
  return SavedOptions
}

function getLocalStorage (params = null) {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(params, (storage) => {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError)
      }
      resolve(storage)
    })
  })
}
