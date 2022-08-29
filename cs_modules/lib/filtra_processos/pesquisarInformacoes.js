function PesquisarInformacoes(BaseName) {

	/** inicialização do módulo ***************************************************/
	var mconsole = new __mconsole(BaseName + ".PesquisarInformacoes");
	var arrayTabela = [];

	var classeFiltro = 'PorPesquisa';
	var regexPesquisaOu = /^\[(.+)\]$/;

    $('div.infraAreaTabela table').each(function(indexTabela, itemTabela) {
        var tabela = $(itemTabela);
        arrayTabela.push({
            tabela: tabela,
            trs: tabela.find('tbody>tr[class^="infraTr"]')
        });
    });

    $(document.getElementById('txtPesquisaRapida')).on('input change', function() {
        var pesquisaGrupo = false;
        var arrayTermo;
        var texto = this.value.toLowerCase();

        /** Impede o conflito com o script: procedimento_controlar/adicionarOrdenacao.js */
        var tablesorterfilter = false;
        $('#tblProcessosDetalhado, #tblProcessosGerados, #tblProcessosRecebidos').each(function (index, tabela) {
          var filter = $.tablesorter.getFilters($(tabela));
          $.each(filter, function (index, value) {
            if (value != "") tablesorterfilter = true;
          });
        });
        if (tablesorterfilter) {
          mconsole.log("Pesquisa de informações não realizada, pois a tabela já exite pesquisa na tabela");
          return;
        };

        if (texto) {
            if (regexPesquisaOu.test(texto)) {
                arrayTermo = texto.substring(1, texto.length - 1).match(/\S+/g);
                pesquisaGrupo = true;
            } else {
                arrayTermo = [texto];
            }
        }  else {
            arrayTermo = [];
        }

        var termosEncontrados = [];

        $.each(arrayTabela, function(index, itemArrayTabela) {
            if (arrayTermo.length) {
                filtrarTabela(itemArrayTabela.tabela, itemArrayTabela.trs, classeFiltro, function(indexTr, tr) {
                    var textoTr = tr.innerHTML.toLowerCase();
                    for (var i = 0; i < arrayTermo.length; i++) {
                        if (textoTr.indexOf(arrayTermo[i]) !== -1) {
                            if (termosEncontrados.indexOf(arrayTermo[i]) === -1)
                                termosEncontrados.push(arrayTermo[i]);
                            return true;
                        }
                    }
                    return false;
                });
            } else {
                removerFiltroTabela(itemArrayTabela.tabela, itemArrayTabela.trs, classeFiltro);
            }
        });

        if (pesquisaGrupo) {
            for (var i = 0; i < arrayTermo.length; i++) {
                if (termosEncontrados.indexOf(arrayTermo[i]) === -1)
                    mconsole.log("Termo não encontrado: " + arrayTermo[i]);
            }
        }

    });
}
