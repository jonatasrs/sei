function FiltraPorAtribuicao(BaseName) {

	/** inicialização do módulo ***************************************************/
	var mconsole = new __mconsole(BaseName + ".FiltraPorAtribuicao");

	function inicio() {

	    var idTabelaProcessosRecebidos = 'tblProcessosRecebidos';
	    var idTabelaProcessosGerados = 'tblProcessosGerados';
	    var idTabelaProcessosDetalhado = 'tblProcessosDetalhado';

	    var tabelaRecebidos = getTabela(idTabelaProcessosRecebidos);
	    var tabelaGerados = getTabela(idTabelaProcessosGerados);
	    var tabelaDetalhado = getTabela(idTabelaProcessosDetalhado);

	    if ($('#divInfraBarraLocalizacao').text() == 'Controle de Processos' && (tabelaRecebidos.length > 0 || tabelaGerados.length > 0 || tabelaDetalhado.length > 0)) {

	        var keyAtribuido = 'atribuido';

	        var trsRecebidos = getProcessos(tabelaRecebidos);
	        var trsGerados = getProcessos(tabelaGerados);
	        var trsDetalhado = getProcessos(tabelaDetalhado);

	        var captionRecebidos = getTabelaCaption(tabelaRecebidos);
	        var captionGerados = getTabelaCaption(tabelaGerados);
	        var captionDetalhado = getTabelaCaption(trsDetalhado);

	        var trs = trsRecebidos.add(trsGerados).add(trsDetalhado);

	        var idVerSomenteMeusProcessos = 'divFiltro';

	        var selectVerProcessosDe = newElement('select')
	        .change(function() {
	            changeSelectVerProcess(this.value, tabelaRecebidos, trsRecebidos, keyAtribuido);
	            changeSelectVerProcess(this.value, tabelaGerados, trsGerados, keyAtribuido);
	            changeSelectVerProcess(this.value, tabelaDetalhado, trsDetalhado, keyAtribuido);
	        }).append([
	            newElement('option')
	            .attr('value', '*')
	            .text('Ver todos os processos'),
	            newElement('option')
	            .attr('value', '')
	            .text('Ver processos não atribuídos')
	        ]);

	        adicionarOptionAtribuido(selectVerProcessosDe, trs);

	        atualizaSelect(selectVerProcessosDe, keyAtribuido);

	        $('#' + idVerSomenteMeusProcessos).css('height', 'auto').css('font-size', 'smaller').prepend(criarTabelaNova(selectVerProcessosDe));
	    }
	}

	function newElement(elemento) {
	    return $(document.createElement(elemento));
	}

	function criarTabelaNova(selectNovo) {
	    let novaTabela = newElement('table').css('width', '100%');
	    let novoTr = newElement('tr').appendTo(newElement('tbody')).appendTo(novaTabela);
	    console.log(novoTr);
	    novoTr.append(newElement('td').append(selectNovo));
	    novoTr.append(newElement('td').append($('#divMeusProcessos').css('position', 'initial')));
	    novoTr.append(newElement('td').append($('#divVerPorMarcadores').css('position', 'initial').css('text-align', 'center')));
	    novoTr.append(newElement('td').append($('#divTipoVisualizacao').css('position', 'initial').css('text-align', 'right')));
	    return novaTabela;
	}

	function atualizaSelect(select, keyAtribuido) {
	    var value = valorSalvoGet();
	    if (typeof value !== 'undefined') {
	        if (select.children("option[value='" + value + "']").length > 0)
	            select.val(value).change();
	        else
	        	valorSalvoDelete();
	    }
	}

	function adicionarOptionAtribuido(select, trs) {
	    var nomes = {};
		getLinkAtribuido(trs).each(function(index, alink) {
			nomes[alink.innerHTML] = getAtribuido(alink);
		});
		Object.keys(nomes).sort().forEach(function(id) {
	        select.append(
	            newElement('option')
	            .attr('value', id)
	            .text('Ver processos atribuídos à ' + nomes[id])
	        );
		});
	}

	var classeFiltro = 'PorAtribuicao';

	function changeSelectVerProcess(value, tabela, trs, keyAtribuido) {
	    if (value !== '*') {
	        filtrarTabela(tabela, trs, classeFiltro, function(indexTr, tr) {
	            var alink = getLinkAtribuido($(tr));
	            return (value === "" && alink.length === 0) || alink.text() === value;
	        });
	    } else {
	        removerFiltroTabela(tabela, trs, classeFiltro);
	    }
	    valorSalvoSet(value);
	}

	function getLinkAtribuido(trs) {
	    return trs.find('td:nth-child(4) a');
	}

	function getAtribuido(alink) {
		if (SavedOptions.filtraporatribuicao === 'nome')
			return alink.title.substr(15);
		return alink.innerHTML;
	}

	function getTabela(idTabelaProcessos) {
	    return $('#' + idTabelaProcessos).first();
	}

	function getProcessos(tabela) {
	    return tabela.children('tbody').first().children('tr[class^="infraTr"]');
	}

	function getTabelaCaption(tabela) {
	    return tabela.children('caption.infraCaption');
	}

	function valorSalvoGet() {
		return null;
	}

	function valorSalvoSet(valor) {
	}

	function valorSalvoDelete() {
	}

	
	inicio();
}