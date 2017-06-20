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

/*** Configuracoes ************************************************************/
/* Generic error logger */
function onError(e) {console.error(e);}

/* Verifica, lê as configurações salvas e execultas as rotinas necessárias */
function checkStoredSettings(storedSettings) {
	if (!storedSettings.theme || !storedSettings.CheckTypes) {
		browser.storage.local.set(defaultSettings);
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

	/* Execulta os scripts na ao carregar a página */
	for (let item of CheckTypes) {
		switch (item) {
			case "prazo":
			case "qtddias":
				ExecutarCalculoPrazo(item);
				break;
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

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);

/*** Fim **********************************************************************/
