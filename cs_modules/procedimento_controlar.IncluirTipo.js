// CEPESC:
function IncluirTipo(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".IncluirTipo");

  IncluirColunaTabela("#tblProcessosDetalhado");
  IncluirColunaTabela("#tblProcessosGerados");
  IncluirColunaTabela("#tblProcessosRecebidos");

  function IncluirColunaTabela(IdTabela) {
    var table = $(IdTabela);

    var divGerados = document.getElementById("divGeradosAreaTabela");
    var divRecebidos = document.getElementById("divRecebidos");

    divGerados.style.wordWrap = "break-word";
    divRecebidos.style.wordWrap = "break-word";

    if ($(IdTabela).length > 0) {
      /* Remove os eventos da tabela: Precisa para funcionar no Chrome */
      RemoveAllOldEventListener(table);
      table = $(IdTabela);

      /* Inclui o cabeçalho na tabela */
      var h = $("<th/>")
        .addClass("tituloControle")
        .text("Tipo de Processo");
      $(IdTabela + " > thead > tr").append(h);

      /* Inclui os itens na tabela */
      $(IdTabela + " > tbody > tr").each(function (index) {
        var cell = $("<td/>").attr("valign", "top").attr("align", "left")
          .text(getTipo(this));

        $(this).append(cell);
      })
    }
  }

  /*** Pega o Tipo do processo */
  function getTipo(item) {
    var cel = $(item).find(".processoVisualizado, .processoNaoVisualizado");

    if ($(cel).length > 0) {
      var str = $(cel).attr("onmouseover");

      str = str.substring(str.indexOf("'", str.indexOf(",")) + 1, str.indexOf("'", str.indexOf("'", str.indexOf(",")) + 1));

      return str;
    }
    return "";
  }
}