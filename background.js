/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/

/******************************************************************************
 * Execulta ao instalar ou atualizar o complemento.                           *
 ******************************************************************************/
function handleInstalled(details) {
	console.log(details.reason);
	
	function onError(error) {console.log(`Error: ${error}`);}

	var gettingItem = browser.storage.local.get("CheckTypes");
	gettingItem.then((item) => {
		if (item.CheckTypes.indexOf("hidemsgupdate") == -1) {
			browser.tabs.create({url: "https://jonatasrs.github.io/sei/"});
		}
	}, onError);
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
browser.runtime.onInstalled.addListener(handleInstalled);