function IncluirCalculoPrazos(BaseName, TipoDeCalculo) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".IncluirCalculoPrazos");

  IncluirColunaTabela("#tblProcessosDetalhado", TipoDeCalculo);
  IncluirColunaTabela("#tblProcessosGerados", TipoDeCalculo);
  IncluirColunaTabela("#tblProcessosRecebidos", TipoDeCalculo);

  function IncluirColunaTabela(IdTabela, TipoDeCalculo) {
    var table = $(IdTabela);

    if ($(IdTabela).length > 0) {
      /* Remove os eventos da tabela: Precisa para funcionar no Chrome */
      RemoveAllOldEventListener(table);
      table = $(IdTabela);

      /* Inclui o cabeçalho na tabela */
      var h = $("<th/>")
      .addClass("tituloControle")
      .text((TipoDeCalculo == "qtddias") ? "Dias":"Prazo");
      $(IdTabela + " > thead > tr").append(h);

      /* Inclui os itens na tabela */
      $(IdTabela + " > tbody > tr").each(function (index) {
        var cell = $("<td/>").attr("valign", "top").attr("align", "center")
                   .text(Calcular(this, TipoDeCalculo));

        $(this).append(cell);

        FormatarTabela(this, $(cell).text(), TipoDeCalculo);
      })
    }
  }

  /*** Calcula o numero de dias com base no texto do marcador */
  function Calcular(item, TipoDeCalculo) {
    var msecPerDay = 1000 * 60 * 60 * 24;
    var cel = $(item).find("td > a[href*='acao=andamento_marcador_gerenciar']");

    if ($(cel).length > 0) {
      var str = $(cel).attr("onmouseover");

      str = str.substring(str.indexOf("'") + 1, str.indexOf("'", str.indexOf("'") + 1));
      str = str.toLowerCase().replace("é", "e");

      var hoje = new Date(); // Pega a data atual
      var hojeMsec = hoje.getTime();

      if (TipoDeCalculo == "prazo") {
        if (str.indexOf("ate ") == 0) {
          str = str.substr(4, 10);
        } else {
          return "";
        }
      } else {
        str = str.substr(0, 10);
      }

      if (str.length == 10 && isNumOnly(str.replace("/", ""), 10)) {
        var datei = new Date(str.substring(6, 10), str.substring(3, 5) - 1, str.substring(0, 2)); // yyyy,m,y (m-> 0-11)

        if (!isNaN(datei.getDate())) {
          if (TipoDeCalculo == "qtddias") {
            var interval = hojeMsec - datei.getTime();
            var days = Math.floor(interval / msecPerDay);
          } else if (TipoDeCalculo == "prazo") {
            var interval = datei.getTime() - hojeMsec;
            var days = Math.floor(interval / msecPerDay) + 1;
          }
          return days;
        }
      }
    }
    return "";
  }

  /* Formata a tabela pelos valores */
  function FormatarTabela(Linha, Valor, TipoDeCalculo) {
    if(Valor === "") return;
    if (TipoDeCalculo == "qtddias") {
      if (Valor > SavedOptions.ConfDias.Alerta && Valor <= SavedOptions.ConfDias.Critico) {
        $(Linha).attr("class", "infraTrseippalerta");
      } else if (Valor > SavedOptions.ConfDias.Critico) {
        $(Linha).attr("class", "infraTrseippcritico");
      }
    } else if (TipoDeCalculo == "prazo") {
      if (Valor >= SavedOptions.ConfPrazo.Critico && Valor < SavedOptions.ConfPrazo.Alerta) {
        $(Linha).attr("class", "infraTrseippalerta");
      } else if (Valor < SavedOptions.ConfPrazo.Critico) {
        $(Linha).attr("class", "infraTrseippcritico");
      }
    }
  }
}