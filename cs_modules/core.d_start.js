/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/
const BaseName = "Seipp.core.d_start";

function Main(Options) {
  /** Carrega as opções configuradas */
  SavedOptions = Options;

	if (Options.theme != "white") {
    Theme(BaseName);
  }

  SavedOptions.CheckTypes.forEach(function(element) {
    switch (element) {
      case "pontocoresanatel":
        PontoControleCores(BaseName);
        break;
      default:
        break;
    }
  }, this);

  if (window.location.href ==
    (window.location.protocol + "//" + window.location.hostname + "/sei/")) {
    RedirecionarPagina(BaseName);
  }
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
function onError(e) {console.error(e);}

setTimeout(function () {
	if (isChrome) { /* Chrome: */
		browser.storage.local.get(SetTheme);
	} else {
		const gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(Main, onError);
	}
}, 10);
