function adicionarOrdenacao(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".adicionarOrdenacao");

  if ($(".infraAreaPaginacao").children().length == 0) { $(".infraAreaPaginacao").hide(); }

  $('#tblProcessosDetalhado, #tblProcessosGerados, #tblProcessosRecebidos').each(function (index, tabela) {
    var idt = $(tabela).attr("id");

    mconsole.log("Configurando o tablesorter na tabela: " + idt);
    $(tabela).tablesorter({
      textExtraction: {
        1: function (node, table, cellIndex) {
          let img = node.querySelector('img[src^="imagens/sei_anotacao"]');
          if (img) {
            var prioridade = img.src.indexOf('prioridade') != -1 ? '1' : '2';
            var strfuncao = img.parentNode.getAttribute('onmouseover');
            var start = strfuncao.indexOf('infraTooltipMostrar') + 21;
            var end = strfuncao.indexOf("'", start);
            return prioridade + ' ' + strfuncao.substring(start, end);
          }
          return '3';
        }
      },
      headers: {
        0: { sorter: false, filter: false },
        1: { filter: false }
      },
      widgets: ["saveSort", "filter"],
      widgetOptions: {
        saveSort: true,
        filter_hideFilters: true,
        filter_columnFilters: true,
        filter_saveFilters: true,
        filter_hideEmpty: true,
        filter_excludeFilter: {}
      },
      sortReset: true
    });

    mconsole.log("Criando o filtro na tabela: " + idt);
    $(this).parent()
      .prepend('<input id="limpar" value="Limpar filtro" type="button" class="infraButton">').prepend("&nbsp;")
      .prepend('<input id="filtrar" value="Filtrar tabela" type="button" class="infraButton">');
    $(this).parent().find("#filtrar").on("click", function () {
      RemoverFiltroPesquisa($(tabela));
      $(tabela).find(".tablesorter-filter-row").removeClass("hideme");
    });
    $(this).parent().find("#limpar").on("click", function () {
      RemoverFiltroPesquisa($(tabela));
      $(tabela).trigger('filterReset');
    });
    $(tabela).on("filterEnd", function (event, data) {
      var caption = $(tabela).find("caption")[0];
      var tx = $(caption).text();
      $(caption).text(tx.replace(/\d+/g, data.filteredRows));
      mconsole.log(idt + ": Registros filtrados > " + data.filteredRows);

      /** Impede a seleção de itens filtrados da tabela, ao clicar em selecionar todos. */
      $(tabela).find("tbody > tr:visible > td > input").removeAttr("disabled");
      $(tabela).find("tbody > tr:hidden > td > input").attr("disabled", "");
    })
  });

  /**
   * Impede o conflito com o script: lib.filtra_processos.PesquisarInformacoes.js
   * @param {*} params
   */
  function RemoverFiltroPesquisa($tabela) {
    if ($tabela.attr("data-filtro") != undefined) {
      removerFiltroTabela($tabela, $tabela.find('tbody>tr[class^="infraTr"]'), "PorPesquisa");
    }
  }

}
