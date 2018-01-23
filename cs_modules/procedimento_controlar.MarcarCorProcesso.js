function MarcarCorProcesso(BaseName) {
  /** inicialização do módulo */

  var mconsole = new __mconsole(BaseName + ".MarcarCorProcesso");

  IncluirCorTabela("#tblProcessosDetalhado");
  IncluirCorTabela("#tblProcessosGerados");
  IncluirCorTabela("#tblProcessosRecebidos");

  function IncluirCorTabela(IdTabela) {
    var tabela = $(IdTabela);

    if ($(IdTabela).length > 0) {
      tabela = $(IdTabela);

      for (i = 1; i < tabela["0"].rows.length; i++) {
        var cor = EscolherCor(tabela["0"].rows[i].cells[2].innerHTML);
        FormatarTabela(tabela["0"].rows[i].cells["2"].children["0"], cor);
      }
    }
  }

  function EscolherCor(item) {
    var Cores = SavedOptions.ConfiguracoesCores;
    item = item.substring(item.indexOf("onmouseover") + 40);
    item = item.substring(1, item.indexOf(');" onmouseout='));
    for (contador = 0; contador < Cores.length; contador++) {
      if (Cores[contador].valor != "") {
        if (item.indexOf(Cores[contador].valor) != -1) {
          return Cores[contador].cor;
        }
      }
    }
    return "";
  }

  /* Formata a tabela pelos valores */
  function FormatarTabela(Linha, Cor) {
    if (Cor != "") {
      $(Linha).attr("style", "background-color: " + Cor + "; padding: 0 1em 0 1em");
    }
  }
}