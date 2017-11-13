function AdicionarOrdenacao(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".AdicionarOrdenacao");

  /* Adiciona a ordenação nas tabelas "jquery.tablesorter" */
  OrdenarTabela("#tblProcessosDetalhado");
  OrdenarTabela("#tblProcessosGerados");
  OrdenarTabela("#tblProcessosRecebidos");

  /* Adiciona a ordenação na tabela "jquery.tablesorter" */
  function OrdenarTabela(IdTabela) {
    var table = $(IdTabela);

    if (!(table == null)) {
      /*Execulta a ordenação */
      $(document).ready(function () {
        $(table).tablesorter({
          headers: { 0: { sorter: false }, 1: { sorter: false } },
          widgets: ["saveSort"], widgetOptions: { saveSort: true },
          sortReset: true,
        });
      });
    }
  }
}