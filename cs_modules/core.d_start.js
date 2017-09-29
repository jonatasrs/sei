/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/
const ModName_start = "Seipp.core.d_start";

function Main(Options) {
  console.log(ModName_start + ": >>>");
  /** Carrega as opções configuradas */
  SavedOptions = Options;

	if (SavedOptions.theme != "white") {
    Theme(ModName_start, SavedOptions.Theme);
  }

  SavedOptions.CheckTypes.forEach(function(element) {
    switch (element) {
      case "pontocoresanatel":
        PontoControleCores(ModName_start);
        break;
      default:
        break;
    }
  }, this);

  if (window.location.href ==
    (window.location.protocol + "//" + window.location.hostname + "/sei/")) {
    RedirecionarPagina(ModName_start);
  }
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
function onError(e) {console.error(e);}

setTimeout(function () {
	if (isChrome) { /* Chrome: */
		browser.storage.local.get(Main);
	} else {
		const gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(Main, onError);
	}
}, 10);
