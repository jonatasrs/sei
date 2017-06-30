/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo / Diego Rossi / Hebert M. Magalhães
*******************************************************************************/

/*** Calcula o numero de dias com base no texto do marcador */
function Calcular(item, TipoDeCalculo) {
	var msecPerDay = 1000 * 60 * 60 * 24;
	var cel = item.cells[1].getElementsByTagName("a");

	if (cel != null) {
		for (var x = 0; x < cel.length; x++) {
			var str = cel[x].getAttribute("href");
			if (str.indexOf("acao=andamento_marcador_gerenciar") != -1) {
				/* Pega o texto do marcador */
				str = cel[x].getAttribute("onmouseover");
				str = str.substring(str.indexOf("'") + 1, str.indexOf("'", str.indexOf("'") + 1));
				str = str.toLowerCase().replace("é", "e");

				var hoje = new Date(); // Pega a data atual
				var hojeMsec = hoje.getTime();

				if (TipoDeCalculo == "prazo") {
					if (str.indexOf("ate ") == 0) {
						str = str.substr(4, 10);
					} else {
						return "";
					}
				} else {
					str = str.substr(0, 10);
				}

				if (str.length == 10 && isNumOnly(str.replace("/", ""), 10)) {
					var datei = new Date(str.substring(6, 10), str.substring(3, 5) - 1, str.substring(0, 2)); // yyyy,m,y (m-> 0-11)

					if (!isNaN(datei.getDate())) {
						if (TipoDeCalculo == "qtddias") {
							var interval = hojeMsec - datei.getTime();
							var days = Math.floor(interval / msecPerDay);
						} else if (TipoDeCalculo == "prazo") {
							var interval = datei.getTime() - hojeMsec;
							var days = Math.floor(interval / msecPerDay) + 1;
						}
						return days;
					}
				}
			}
		}
	}
	return "";
}

function isNumOnly(str) {
	if (isNaN(parseInt(str))) {
		return false;
	} else {
		return true;
	}
}

function IncluirColunaTabela(IdTabela, TipoDeCalculo) {
	var table = document.getElementById(IdTabela);

	if (!(table == null)) {
		/* Inclui o cabeçario na tabela */
		var h = document.createElement("th");
		h.setAttribute("class", "tituloControle");
		if (TipoDeCalculo == "qtddias") {
			h.innerHTML = "Dias";
		} else if (TipoDeCalculo == "prazo") {
			h.innerHTML = "Prazo";
		}
		table.rows[0].appendChild(h);

		/* Inclui os itens na tabela */
		for (var i = 1; i < table.rows.length; i++) {
			var cell = document.createElement("td");
			cell.setAttribute("valign", "top");
			cell.setAttribute("align", "center");
			/* Chama a função para calcular o nº de dias */
			cell.textContent = Calcular(table.rows[i], TipoDeCalculo);
			table.rows[i].appendChild(cell);

			FormatarTabela(table.rows[i], cell.innerHTML, TipoDeCalculo);
		}
	}
	return;
}

/* Formata a tabela pelos valores */
function FormatarTabela(Linha, Valor, TipoDeCalculo) {
	Linha.onmouseout=null;
	Linha.onmouseover=null;

	if (TipoDeCalculo == "qtddias") {
		if (Valor > 20 & Valor < 31) {
			$(Linha).attr("class", "seipp-alerta");
		} else if (Valor > 30) {
			$(Linha).attr("class", "seipp-critico");
		}
	} else if (TipoDeCalculo == "prazo") {
		if ((Valor >= 1 & Valor < 4) | Valor == "0") {
			$(Linha).attr("class", "seipp-alerta");
		} else if (Valor < 0) {
			$(Linha).attr("class", "seipp-critico");
		}
	}
}

function ExecutarCalculoPrazo(TipoDeCalculo) {
	IncluirColunaTabela("tblProcessosDetalhado", TipoDeCalculo);
	IncluirColunaTabela("tblProcessosGerados", TipoDeCalculo);
	IncluirColunaTabela("tblProcessosRecebidos", TipoDeCalculo);
}

/* Adiciona a ordenação na tabela "jquery.tablesorter" */
function OrdenarTabela(IdTabela) {
	var table = $("#" + IdTabela);

	if (!(table == null)) {
		/* Corrige a tabela para utilizar o "jquery.tablesorter" */
		$("#" + IdTabela + " caption").after("<thead></thead>");
		$("#" + IdTabela + " thead").append($("#" + IdTabela + " tbody tr:first-child"));

		/*Execulta a ordenação */
		$(document).ready(function () {
			$(table).tablesorter({
				headers: {0: {sorter: false}, 1: {sorter: false}}
			});
		});
	}
}
/***Verifica a existência de blocos de assinatura e altera a cor do texto no menu, caso exista*/
function verificaBlocoAssinatura() {
  var servidor = window.location.protocol + "//" + window.location.hostname + "/sei/"; //Obtém o caminho absoluto para a requisição assíncrona
  //console.log(servidor);
  var bloco = document.getElementById('main-menu').childNodes[15].getElementsByTagName('a') [0].getAttribute('href'); //obtem o link para o bloco de assinaturas, com respectivo hash
  var oReq = new XMLHttpRequest();
  oReq.addEventListener('load', reqListener);
  oReq.open('GET', servidor + bloco);
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
	document.getElementById('main-menu').childNodes[15].getElementsByTagName('a') [0].innerHTML = "<b> Blocos de Assinatura </b>" + html;
	document.getElementById('main-menu').childNodes[15].getElementsByTagName('a') [0].setAttribute("class", "seipp-assinatura");
  }
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
			case "prazo":
			case "qtddias":
				ExecutarCalculoPrazo(item);
			break;
			case "chkbloco":
				verificaBlocoAssinatura();
			case "hidemsgupdate":
				break;
			default:
				console.log("Configuração não implementada: " + item);
		}
	}

	/* Adiciona a ordenação nas tabelas "jquery.tablesorter" */
	OrdenarTabela("tblProcessosDetalhado");
	OrdenarTabela("tblProcessosGerados");
	OrdenarTabela("tblProcessosRecebidos");
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
