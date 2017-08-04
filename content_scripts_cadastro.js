function autoFillDocument(formato, nivelAcesso, hipoteseLegal) {
	var data = new Date();
	var hoje = getFormattedDate(data);
	$("#txtDataElaboracao").val(hoje);
	if(formato == "N")
		$("#optNato").click();
	else
		$("#optDigitalizado").click();
	switch(nivelAcesso) {
		case "R":
			$("#optRestrito").click();
		break;
		case "S":
			$("#optSigiloso").click();
		break;
		default:
			$("#optPublico").click();
	}
	if(nivelAcesso == "S" || nivelAcesso == "R")
		setTimeout(function(){$("#selHipoteseLegal").val(hipoteseLegal);},500);
	var html = '<span style="background-color:red"> Houve preenchimento de valores pré configurados nesta tela. Verifique se estão corretos! </span>';
	$("#divInfraBarraComandosInferior #btnSalvar").before(html);
	$("#divInfraBarraComandosSuperior #btnSalvar").before(html);
	//console.log($("#divInfraBarraComandosInferior").html());

}
function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return day + '/' + month + '/' + year;
}
function displayProps(settings){
	//console.log(settings.nivelAcesso);
	//console.log(settings.formato);
	//console.log(settings.hipoteseLegal);
	const CheckTypes = settings.CheckTypes;
	for (let item of CheckTypes) {
		switch (item) {
			case "cliquemenos":
				autoFillDocument(settings.formato, settings.nivelAcesso, settings.hipoteseLegal);
				break;
			default:
				console.log("Configuração não implementada: " + item);
		}
	}
	
}

if (isChrome) { /* Chrome: */
	browser.storage.local.get(dispalyProps);
} else {
	const gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(displayProps, onError);
}

