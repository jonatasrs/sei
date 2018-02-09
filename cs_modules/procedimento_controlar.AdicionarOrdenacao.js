function AdicionarOrdenacao(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".AdicionarOrdenacao");

  $('#tblProcessosDetalhado, #tblProcessosGerados, #tblProcessosRecebidos').each(function(index, tabela) {
    $(tabela).tablesorter({
      textExtraction: {
        1: function(node, table, cellIndex) {
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
    	  0: { sorter: false }},
      widgets: ["saveSort"],
      widgetOptions: { saveSort: true },
      sortReset: true
    });
  });
}