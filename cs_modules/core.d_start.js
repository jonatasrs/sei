/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/
const ModName_start = "core.d_start";

function Main(Options) {
  Init(ModName_start);

  /** Carrega as opções configuradas */
  if (Options.theme != undefined) {
    SavedOptions = Options;
  }

  if (SavedOptions.theme != "white") {
    setTimeout(function () {
      Theme(ModName_start, SavedOptions.Theme);
    }, 10);
  }

  if (window.location.href == GetBaseUrl()) {
    setTimeout(function () {
      RedirecionarPagina(ModName_start);
    }, 100);
  }
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
function onError(e) { console.error(e); }

if (isChrome) { /* Chrome: */
  browser.storage.local.get(Main);
} else {
  const gettingStoredSettings = browser.storage.local.get();
  gettingStoredSettings.then(Main, onError);
}
