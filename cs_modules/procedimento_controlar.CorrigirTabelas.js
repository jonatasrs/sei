function CorrigirTabelas(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".CorrigirTabelas");

  PCorrigir("#tblProcessosDetalhado");
  PCorrigir("#tblProcessosGerados");
  PCorrigir("#tblProcessosRecebidos");

  /* Corrige a tabela para utilizar o "jquery.tablesorter" */
  function PCorrigir(IdTabela) {
    var table = $(IdTabela);

    if (!(table == null)) {
      $(IdTabela + " caption").after("<thead></thead>");
      $(IdTabela + " thead").append($(IdTabela + " tbody tr:first-child"));
    }
  }
}