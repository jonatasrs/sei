function RetirarSobrestamentoReabrirEmBloco(BaseName) {

	/** inicialização do módulo ***************************************************/
	var mconsole = new __mconsole(BaseName + ".RetirarSobrestamentoReabrirEmBloco");

	var regexHrefPage3 = /Nos[\s]*\[[\s]*0[\s]*\][\s]*=[\s]*new[\s]*infraArvoreNo[\s]*\([\s]*"\w+"[\s]*,[\s]*"\d+"[\s]*,[\s]*null,[\s]*"([^\"]+)"/;
	var regexHrefPage4Sobrestado = /(controlador\.php\?acao=procedimento_remover_sobrestamento[^']+)/;
	var regexHrefPage4Fechado = /(controlador\.php\?acao=procedimento_reabrir[^']+)/;

	var idModalSaida = 'idModalSaida';
	var idTextoSaida = 'idTextoSaida';
	var titleModal = 'Status da operação...';

	function newElement(elemento) {
	    return $(document.createElement(elemento));
	}

	function imprimirLog(msg) {
	    mconsole.log(msg);
	    imprimirStatus(msg);
	}

	function imprimirError(msg) {
	    console.error(msg);
	    imprimirStatus(msg);
	}

	function imprimirStatus(msg) {
	    var totalTextoSaida = textoSaida.val();
	    textoSaida.val((totalTextoSaida ? totalTextoSaida + '\n' : '') + msg);
	    if(textoSaida.length)
	        textoSaida.scrollTop(textoSaida[0].scrollHeight - textoSaida.height());
	}

	function parseCall(parseFunction, callFunction, numeroProcesso, numeroChamada) {
	    var resultado;
	    try {
	        resultado = parseFunction();
	    } catch (err) {}
	    var msgerror;
	    if (resultado && resultado.href) {
	        imprimirLog(numeroProcesso + ' (' + numeroChamada + '/4)...');
	        $.get(resultado.href, null, callFunction).fail(function() {
	            imprimirError(numeroProcesso + ' (Erro na chamada nº ' + numeroChamada + ')!');
	        });
	    } else {
	        if (resultado) {
	            imprimirError(numeroProcesso + ' (' + resultado.error + ')!');
	        } else {
	            imprimirError(numeroProcesso + ' (Erro na chamada nº ' + numeroChamada + ')!');
	        }
	    }
	}

	function getLink(linkRelativo) {
		return window.location.origin + '/sei/' + linkRelativo;
	}

	function removerSobrestamento(element, index, total) {

	    var numeroProcesso = element.textContent;

	    parseCall(function() {
	        return {href: element.href};
	    }, function(dataPagina2) {

	        parseCall(function() {
	            return {href: getLink($($.parseHTML(dataPagina2)).find('#ifrArvore').attr('src'))};
	        }, function(dataPagina3) {

	            let isRemoverSobrestamento = false;
	            let isReabrir = false;

	            parseCall(function() {
	                var textScript = $($.parseHTML(dataPagina3, null, true)).filter('script').text();
	                isRemoverSobrestamento = textScript.indexOf('imagens/sei_remover_sobrestamento_processo.gif') !== -1;
	                isReabrir = textScript.indexOf('imagens/sei_reabrir_processo.gif') !== -1;
	                if (isRemoverSobrestamento || isReabrir)
	                    return {href: getLink(textScript.match(regexHrefPage3)[1])};
	                return {error: "Processo não se encontra sobrestado ou fechado"};
	            }, function(dataPagina4) {

	                parseCall(function() {
	                    if (isRemoverSobrestamento)
	                        return {href: getLink($($.parseHTML(dataPagina4, null, true)).filter('script').text().match(regexHrefPage4Sobrestado)[1])};
	                    else if (isReabrir)
	                        return {href: getLink($($.parseHTML(dataPagina4, null, true)).filter('script').text().match(regexHrefPage4Fechado)[1])};
	                    else
	                        return {error: "Processo não se encontra sobrestado ou fechado"};
	                }, function() {
	                    imprimirLog(numeroProcesso + ' (Reaberto com sucesso!)');
	                }, numeroProcesso, 4);
	            }, numeroProcesso, 3);
	        }, numeroProcesso, 2);
	    }, numeroProcesso, 1);
	}

	$('html body').first().append(
	    newElement('div').attr({id: idModalSaida})
	    .append(newElement('form').append(
	        newElement('textarea').attr({id: idTextoSaida, rows: '25', cols: '70'}).prop( "disabled", true )))
	);

	$('#' + idModalSaida).dialog({autoOpen: false, modal: true, width: 'auto'});

	var textoSaida = $('#' + idTextoSaida);

	$('#divInfraBarraComandosSuperior').prepend(
	    newElement('button').attr({
	        id: 'idRetirarSobrestamento',
	        value: 'Reabrir',
	        type: 'button'
	    }).addClass('infraButton')
	    .text('Reabrir Processo')
	    .click(function() {
	        var links = $('input.infraCheckbox:checked').parent().next().next().children('a');
	        if (links.length === 0) {
	            alert('Nenhum processo para reabrir selecionado.');
	        } else {
	            if (confirm('Confirma a reabertura dos processos selecionados?')) {
	                textoSaida.val('');
	                $('#' + idModalSaida).dialog('option', 'title', titleModal).dialog('open');
	                links.each(function(index, element) { removerSobrestamento(element, index, links.length); });
	            }
	        }
	    }));
}