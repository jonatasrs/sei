function CorrigirTabelas(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".CorrigirTabelas");

  $('#tblProcessosDetalhado, #tblProcessosGerados, #tblProcessosRecebidos').each(function (index, tabela) {
    $("<thead></thead>").insertAfter(tabela.querySelector('caption')).append(tabela.querySelector('tbody>tr:first-child'));
  });

  // CEPESC:
  // Adiciona a palavra NUP na frente dos cabeçalhos das colunas GERADOS e RECEBIDOS das tabelas. Também especifica tamanho mínimo
  var headers = $("th:contains(Gerados), th:contains(Recebidos)");
  headers.prepend("NUP ");
  headers.css({
      "min-width": "155px"
  });
}