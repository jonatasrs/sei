/* eslint-disable no-global-assign */
/* global seiVersionCompare, CompName, SavedOptions, deepMerge */

// eslint-disable-next-line no-unused-vars
async function ModuleInit (BaseName, PageReload = false) {
  try {
    const storageData = await getLocalStorage()
    const defaultOptions = await loadDefaultOptions(storageData)

    const ModName = CompName + '.' + BaseName
    const IsModExec = $("head meta[name='" + ModName + "'").attr('value')

    if (seiVersionCompare('<', '3')) {
      throw new Error('SEI/SUPER não encontrado.')
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
  } catch (e) {
    const message = `[${CompName} ${Date.now()}] ${BaseName} ${e.message}`
    throw new Error(message)
  }
}

async function loadDefaultOptions (storageData) {
  SavedOptions = deepMerge(SavedOptions, storageData)
  return SavedOptions
}

function getLocalStorage (params = null) {
  return new Promise((resolve, reject) => {
    currentBrowser.storage.local.get(params, (storage) => {
      if (currentBrowser.runtime.lastError) {
        reject(currentBrowser.runtime.lastError)
      }
      resolve(storage)
    })
  })
}
