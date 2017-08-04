/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
function SetTheme(Options) {
	if (Options.theme == "black" &&
		document.baseURI.indexOf("acao=editor_montar") == -1) {
		console.log(window.location.href);
		console.log(window.location.protocol + "//" + window.location.hostname + "/sei/");
		console.log(document.baseURI);
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.id   = "seipp-theme";
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = browser.extension.getURL("themes/black.css");
		link.media = 'all';
		head.appendChild(link);
	}
	
	/* (ANATEL) Anatel Ponto de controle cores */
	if (Options.CheckTypes.indexOf("pontocoresanatel") != -1 &&
		document.baseURI.indexOf("acao=editor_montar") == -1) {
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.id   = "seipp-pontocores-anatel";
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = browser.extension.getURL("themes/PontoControleCores_Anatel.css");
		link.media = 'all';
		head.appendChild(link);
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
		gettingStoredSettings.then(SetTheme, onError);
	}
}, 10);





