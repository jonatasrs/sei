/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo / Diego Rossi / Hebert M. Magalhães
*******************************************************************************/

/***Verifica a existência de blocos de assinatura e altera a cor do texto no menu, caso exista*/
function localizaItemBloco() {
	var element;
	$("#main-menu li" ).each(function(index)
                     {if($(this).text().indexOf("Assinatura") != -1)element = $(this);});
	return element;
}
function verificaBlocoAssinatura() {
  var servidor = window.location.protocol + "//" + window.location.hostname + "/sei/"; //Obtém o caminho absoluto para a requisição assíncrona
  //console.log(servidor);
  var bloco = localizaItemBloco(); //obtem o elemento html para o bloco de assinaturas
  if (bloco == undefined) return;
  var link = bloco.find("a").attr("href"); //link com hash
  var oReq = new XMLHttpRequest();
  oReq.addEventListener('load', reqListener);
  oReq.open('GET', servidor + link);
  oReq.responseType = 'document';
  oReq.send();
}
function reqListener() {
  var numAbertos = 0;
  var numDispPelaArea = 0;
  var numDispParaArea = 0;
  var numRetornado = 0;
  var html = "";
  var tabela = this.responseXML.getElementById('divInfraAreaTabela').childNodes[1].getElementsByTagName('tr') //todas as linhas da tabela de blocos (caso exista)
  var numBlocos = tabela.length; //quantidade de linhas da tabela (zero, caso não tenha blocos, numero de blocos + 1 caso tenha)
  if (numBlocos != 0)
  numBlocos--; //não conta a linha de cabeçalho
  //alert('Você tem ' + numBlocos + ' blocos de assinatura');
  for (var i = 1; i <= numBlocos; i++) {
    var linhas = tabela.item(i).getElementsByTagName('td'); //itera por todas as linhas, verifcando a terceira coluna (Estado)
    var tipo = linhas.item(2).innerHTML; //terceira coluna (Estado)
    if (tipo == 'Disponibilizado') {
      var areaDisp = linhas.item(4).innerHTML; //se disponibilizado, verifica a Unidade de disponibilização.
      if (areaDisp != '') { //se não estiver em branco, significa disponibilizado pela minha área
        numDispPelaArea++;
      }
      else
      numDispParaArea++; //disponibilizado para a minha área
    }
    else if (tipo == 'Aberto') {
      numAbertos++;
    }
    else
    numRetornado++;
  }
  if (numBlocos > 0) {
    if(numDispParaArea > 0) {
		html = "<img src=" + browser.extension.getURL("icons/iconRed.png") + " title='Blocos disponibilizados para minha área: "+numDispParaArea+"'>";
	}
	if(numDispPelaArea > 0) {
		html += "<img src=" + browser.extension.getURL("icons/iconBlue.png") + " title='Blocos disponibilizados pela minha área: "+numDispPelaArea+"'>";
	}
	if(numRetornado > 0) {
		html += "<img src=" + browser.extension.getURL("icons/iconGreen.png") + " title='Blocos retornados: "+numRetornado+"'>";
	}
	if(numAbertos > 0) {
		html += "<img src=" + browser.extension.getURL("icons/iconYellow.png") + " title='Blocos abertos: "+numAbertos+"'>";
	}
	localizaItemBloco().find("a").html("<b> Blocos de Assinatura </b>" + html);
	localizaItemBloco().find("a").attr("class", "seipp-assinatura");
  }
}

/*** MENU SUSPENSO ************************************************************/
function MenuSuspenso() {
	if ($("#lnkInfraMenuSistema").attr("title").indexOf("Ocultar") != -1) {
		$("#divInfraAreaTelaD").width("99%");
		$("#divInfraAreaTelaE").hide();
	}
	$("#lnkInfraMenuSistema").hide();
	$("#divInfraAreaTelaE").css({
		"position": "absolute",
		"display": "block",
		"width": "auto"
	});
	$("#divInfraBarraSistemaE img").click(function(e){
    e.stopPropagation(); /* impede a propagação do evento click */
    $("#divInfraAreaTelaE").css({"display": "block"});
		$("#main-menu").toggle("fast");
	});
	$("#main-menu").hide();
	$("#main-menu").addClass("seipp-menu");
	$("#main-menu ul").addClass("seipp-menu");
	$("#main-menu *").click(function(e){e.stopPropagation();})
	/* Oculta o menu ao clicar fora */
	$('body').click(function(){
		if (!$("#main-menu").is(':hidden')){$("#main-menu").toggle("fast");}
	});
}

/*** Configuracoes ************************************************************/
/* Generic error logger */
function onError(e) {console.error(e);}

/* Verifica, lê as configurações salvas e execultas as rotinas necessárias */
function checkStoredSettings(storedSettings) {
	if (!storedSettings.theme || !storedSettings.CheckTypes) {
		browser.storage.local.set(defaultSettings);
		storedSettings = defaultSettings;
	}

	Theme = storedSettings.theme;
	const CheckTypes = storedSettings.CheckTypes;

	/* Evita a execução redundante */
	if ($("#seipp").attr("id") == "seipp") {return;}
	if ($("#tblProcessosDetalhado").hasClass("tablesorter") ||
		$("#tblProcessosGerados").hasClass("tablesorter") ||
		$("#tblProcessosRecebidos").hasClass("tablesorter")) {return;}

	/* Adiciona o indentificador ++ no logo do SEI */
	$("#divInfraBarraSistemaE")
	.append("<div id='seipp'>++</div>");

	/* Executa os scripts na ao carregar a página */
	for (let item of CheckTypes) {
		switch (item) {
			case "chkbloco":
				verificaBlocoAssinatura();
				break;
      case "menususp":
				MenuSuspenso();
				break;
			default:
				console.log("Configuração não implementada: " + item);
    }
	}
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
/* Configuracao padrao */
var defaultSettings = {theme: "white", CheckTypes: ["prazo"]};

if (isChrome) { /* Chrome: */
	browser.storage.local.get(checkStoredSettings);
} else {
	const gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(checkStoredSettings, onError);
}
/*** Fim **********************************************************************/
