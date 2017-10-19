function IncluirCalculoPrazos(BaseName, TipoDeCalculo) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".IncluirCalculoPrazos");

  IncluirColunaTabela("tblProcessosDetalhado", TipoDeCalculo);
  IncluirColunaTabela("tblProcessosGerados", TipoDeCalculo);
  IncluirColunaTabela("tblProcessosRecebidos", TipoDeCalculo);

  function IncluirColunaTabela(IdTabela, TipoDeCalculo) {
    var table = document.getElementById(IdTabela);

    if (!(table == null)) {
      /* Remove os eventos da tabela */
      table.parentNode.replaceChild(table.cloneNode(true), table);
      table = document.getElementById(IdTabela);

      /* Inclui o cabeçalho na tabela */
      var h = document.createElement("th");
      h.setAttribute("class", "tituloControle");
      if (TipoDeCalculo == "qtddias") {
        h.innerHTML = "Dias";
      } else if (TipoDeCalculo == "prazo") {
        h.innerHTML = "Prazo";
      }
      table.rows[0].appendChild(h);

      /* Inclui os itens na tabela */
      for (var i = 1; i < table.rows.length; i++) {
        var cell = document.createElement("td");
        cell.setAttribute("valign", "top");
        cell.setAttribute("align", "center");
        /* Chama a função para calcular o nº de dias */
        cell.textContent = Calcular(table.rows[i], TipoDeCalculo);
        table.rows[i].appendChild(cell);

        FormatarTabela(table.rows[i], cell.innerHTML, TipoDeCalculo);
      }
    }
    return;
  }

  /*** Calcula o numero de dias com base no texto do marcador */
  function Calcular(item, TipoDeCalculo) {
    var msecPerDay = 1000 * 60 * 60 * 24;
    var cel = item.cells[1].getElementsByTagName("a");

    if (cel != null) {
      for (var x = 0; x < cel.length; x++) {
        var str = cel[x].getAttribute("href");
        if (str.indexOf("acao=andamento_marcador_gerenciar") != -1) {
          /* Pega o texto do marcador */
          str = cel[x].getAttribute("onmouseover");
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
      }
    }
    return "";
  }

  function isNumOnly(str) {
    if (isNaN(parseInt(str))) {
      return false;
    } else {
      return true;
    }
  }

  /* Formata a tabela pelos valores */
  function FormatarTabela(Linha, Valor, TipoDeCalculo) {
    if (TipoDeCalculo == "qtddias") {
      if (Valor > 20 & Valor < 31) {
        $(Linha).attr("class", "seipp-alerta");
      } else if (Valor > 30) {
        $(Linha).attr("class", "seipp-critico");
      }
    } else if (TipoDeCalculo == "prazo") {
      if ((Valor >= 1 & Valor < 4) | Valor == "0") {
        $(Linha).attr("class", "seipp-alerta");
      } else if (Valor < 0) {
        $(Linha).attr("class", "seipp-critico");
      }
    }
  }
}