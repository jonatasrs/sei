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

  if (window.isChrome) { /* Chrome: */
    browser.storage.local.get('CheckTypes', AbrirUrlSeipp)
  } else {
    const gettingItem = browser.storage.local.get('CheckTypes')
    gettingItem.then(AbrirUrlSeipp, onError)
  }
}
