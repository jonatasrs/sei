// CEPESC:
function IncluirEspecificacao(BaseName) {

  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".IncluirEspecificacao");

  IncluirColunaTabela("#tblProcessosDetalhado");
  IncluirColunaTabela("#tblProcessosGerados");
  IncluirColunaTabela("#tblProcessosRecebidos");

  function IncluirColunaTabela(IdTabela) {
    var table = $(IdTabela);

    if ($(IdTabela).length > 0) {
      /* Remove os eventos da tabela: Precisa para funcionar no Chrome */
      RemoveAllOldEventListener(table);
      table = $(IdTabela);

      /* Inclui o cabeçalho na tabela */
      var h = $("<th/>")
        .addClass("tituloControle")
        .text("Especificação");
      $(IdTabela + " > thead > tr").append(h);

      /* Inclui os itens na tabela */
      $(IdTabela + " > tbody > tr").each(function (index) {
        var cell = $("<td/>").attr("valign", "top").attr("align", "left");
        var anchor = document.createElement("a");

        anchor.innerHTML = getSpecification(this);
        anchor.href = getURL(this);
        anchor.addEventListener("mouseover", () => window.wrappedJSObject.infraTooltipMostrar(getSpecification(this), getType(this)), false);
        anchor.addEventListener("mouseout", () => window.wrappedJSObject.infraTooltipOcultar());

        cell.append(anchor);
        $(this).append(cell);
      })
    }
  }
}

/*** Retorna a Especificação do processo */
function getSpecification(item) {
  var cel = $(item).find(".processoVisualizado, .processoNaoVisualizado");

  if ($(cel).length > 0) {
    var str = $(cel).attr("onmouseover");

    str = str.substring(str.indexOf("'") + 1, str.indexOf("'", str.indexOf("'") + 1));

    return str;
  }
  return "";
}

/*** Retorna a URL da página do processo selecionado */
function getURL(item) {
  var cel = $(item).find(".processoVisualizado, .processoNaoVisualizado");

  if ($(cel).length > 0) {
    var str = $(cel).attr("href");

    return str;
  }
  return "";
}

/*** Retorna o tipo do processo selecionado */
function getType(item) {
  var cel = $(item).find(".processoVisualizado, .processoNaoVisualizado");

  if ($(cel).length > 0) {
    var str = $(cel).attr("onmouseover");

    return str.split('\'')[3];
  }
  return "";
}