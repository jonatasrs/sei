function CorrigirTabelas(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".CorrigirTabelas");

  $('#tblProcessosDetalhado, #tblProcessosGerados, #tblProcessosRecebidos').each(function(index, tabela) {
    $("<thead></thead>").insertAfter(tabela.querySelector('caption')).append(tabela.querySelector('tbody>tr:first-child'));
  });
}