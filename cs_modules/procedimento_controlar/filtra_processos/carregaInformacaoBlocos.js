function CarregaInformacaoBlocos(BaseName) {

	/** inicialização do módulo ***************************************************/
	var mconsole = new __mconsole(BaseName + ".CarregaInformacaoBlocos");

	function newElement(elemento) {
	    return $(document.createElement(elemento));
	}

	function imprimirLog(msg) {
	    mconsole.log(msg);
	    imprimirStatus(msg);
	}

	function imprimirError(msg) {
	    mconsole.error(msg);
	    imprimirStatus(msg);
	}

	var idSelectTipoBloco = 'idSelectTipoBloco';
	var idSelectBloco = 'idSelectBloco';

	var valBlocoInterno = 'INTERNO';
	var valBlocoAssinatura = 'ASSINATURA';
	var valBlocoReuniao = 'REUNIAO';

	var queryTabelaTrs = 'div.infraAreaTabela table>tbody>tr';
	var queryTrsClasse = '.infraTrClara,.infraTrEscura,.trVermelha';

	var valores = {};

	function setDisabled(element, statusDisabled) {
	    if (statusDisabled) element.prop('disabled', true).addClass('disabled');
	    else element.prop('disabled', false).removeClass('disabled');
	    return element;
	}

	function carregarValor(tipoValor) {
	    setDisabled(selectTipoBloco, true);
	    $.get(getLink(linksBloco[tipoValor]), null, function(dataPagina) {
	        valores[tipoValor] = $($.parseHTML(dataPagina)).find(queryTabelaTrs).filter(queryTrsClasse).map(function() {
	            return extractValorTrBloco(this);
	        }).get();
	        setDisabled(selectTipoBloco, false);
	        apresentarValor(tipoValor);
	    }).fail(function() {
	        var msgErro = 'Erro na chamada tipo ' + tipoValor + '!';
	        console.error(msgErro);
	        alert(msgErro);
	    });
	}

	function extractValorTrBloco(tr) {
	    var link = tr.children[1].children[0];
	    return {
	        numero: link.textContent,
	        href: link.getAttribute("href"),
	        descricao: tr.children[tr.children.length - 2].textContent
	    };
	}

	function apresentarValor(tipoValor) {
	    selectBloco.find('option:not(:first)').remove();
	    var valoresTipoValor = valores[tipoValor];
	    $.each(valoresTipoValor, function(index, valorTipoValor) {
	        selectBloco.append(newElement('option').attr('value', valorTipoValor.numero).text(valorTipoValor.numero + ' - ' + valorTipoValor.descricao));
	    });
	    setDisabled(selectBloco, false).fadeIn();
	}

	function getValorTipoValor(tipoValor, numeroBloco) {
	    var valoresTipoValor = valores[tipoValor];
	    var valoresTipoValorLen = valoresTipoValor.length;
	    for (i = 0; i < valoresTipoValorLen; i++) {
	        if (valoresTipoValor[i].numero === numeroBloco)
	            return valoresTipoValor[i];
	    }
	}

	function carregarProcessos(valorTipoValor) {
	    setDisabled(selectTipoBloco, true);
	    setDisabled(selectBloco, true);
	    $.get(getLink(valorTipoValor.href), null, function(dataPagina) {
	        valorTipoValor.processos = $($.parseHTML(dataPagina)).find(queryTabelaTrs).filter(queryTrsClasse).map(function() {
	            return extractValorTrProcesso(this);
	        }).get();
	        setDisabled(selectTipoBloco, false);
	        setDisabled(selectBloco, false);
	        apresentarProcessos(valorTipoValor);
	    }).fail(function() {
	        var msgErro = 'Erro na chamada processos ' + valorTipoValor.numero + ' - ' + valorTipoValor.descricao + '!';
	        console.error(msgErro);
	        alert(msgErro);
	    });
	}

	var classeFiltro = 'PorBloco';

	function extractValorTrProcesso(tr) {
	    return tr.children[2].children[0].textContent;
	}

	function getTabelas() {
	    return $('div.infraAreaTabela table');
	}

	function apresentarProcessos(valorTipoValor) {
	    getTabelas().each(function(indexTabela, tabela) {
	        filtrarTabela($(tabela), null, classeFiltro, function(indexTr, tr) {
	            return valorTipoValor.processos.indexOf(tr.children[2].children[0].textContent) !== -1;
	        });
	    });
	}

	function mostrarTodos() {
	    getTabelas().each(function(indexTabela, tabela) {
	        removerFiltroTabela($(tabela), null, classeFiltro);
	    });
	}

	function getLink(linkRelativo) {
		return window.location.origin + '/sei/' + linkRelativo;
	}

	$('#divComandos').append(
	    newElement('div').css({'display': 'inline-block', 'vertical-align': 'top', 'float': 'right', 'text-align': 'right'})
	    .append(newElement('select').attr({id: idSelectTipoBloco})
	            .append(newElement('option').attr({value: ''}))
	            .append(newElement('option').attr({value: valBlocoInterno}).text('Blocos Internos'))
	            .append(newElement('option').attr({value: valBlocoAssinatura}).text('Blocos de Assinatura'))
	            .append(newElement('option').attr({value: valBlocoReuniao}).text('Blocos de Reunião'))
	            .change(function() {
	        setDisabled(selectBloco, true).fadeOut();
	        if (selectBloco.val()) selectBloco.val('').change();
	        if (this.value) {
	            if (!valores[this.value]) {
	                carregarValor(this.value);
	            } else {
	                apresentarValor(this.value);
	            }
	        }
	    }))
	    .append(newElement('br'))
	    .append(newElement('select').attr({id: idSelectBloco}).css({'display': 'none', 'max-width': '300px'}).change(function() {
	        if (this.value) {
	            var valorTipoValor = getValorTipoValor(selectTipoBloco.val(), this.value);
	            if (valorTipoValor) {
	                if (!valorTipoValor.processos) {
	                    carregarProcessos(valorTipoValor);
	                } else {
	                    apresentarProcessos(valorTipoValor);
	                }
	            } else console.error('Solicitado uma bloco de tipo não cadastrado.');
	        } else {
	            mostrarTodos();
	        }
	    }).append(newElement('option').attr({value: ''}))));

	var selectTipoBloco = $('#' + idSelectTipoBloco);
	var selectBloco = $('#' + idSelectBloco);

	var linksBloco = {
	    [valBlocoInterno]: $('a[href^="controlador.php?acao=bloco_interno_listar"]').attr('href'),
	    [valBlocoAssinatura]: $('a[href^="controlador.php?acao=bloco_assinatura_listar"]').attr('href'),
	    [valBlocoReuniao]: $('a[href^="controlador.php?acao=bloco_reuniao_listar"]').attr('href')
	};
}
