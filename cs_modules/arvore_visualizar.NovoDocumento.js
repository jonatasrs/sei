function NovoDocumento(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".NovoDocumento");

  /* Espera carregar as ações */
  EsperarAcoes(200);
  function EsperarAcoes(msec) {
    setTimeout(function () {
      if (msec <= 0) {
        reutrn;
      } else if ($("#divArvoreAcoes").children().length == 0) {
        mconsole.log("Esperando... " + msec);
        EsperarAcoes(msec - 10);
      } else {
        AdicionarBotao();
      }
    }, 10);
  }

  function AdicionarBotao(params) {
    /* Verifica se já tem o botão de novo documento */
    var havenewdoc = $('#divArvoreAcoes a[href*="acao=documento_escolher_tipo"]').length;
    var havenewdocp = $('#divArvoreAcoes a[href*="acao=documento_receber"]').length;

    /* Se não tiver o botão faz */
    if (!havenewdoc && !havenewdocp) {
      /* Pega o head do html */
      var b = 0;
      var botao = "";
      var head = $(parent.document.getElementById('ifrArvore').contentWindow.document.head).html();
      var tipo = 'documento_escolher_tipo';
      var a = head.indexOf('<a href="controlador.php?acao=' + tipo);

      if (a == -1) {
        tipo = 'documento_receber';
        a = head.indexOf('<a href="controlador.php?acao=' + tipo);
        if (a == -1) {
          mconsole.log("Link não encontrado.");
          return;
        }
      }
      mconsole.log(tipo);

      /* Adiciona botão novo documento */
      b = head.indexOf("</a>", a) + 4;
      botao = head.substring(a, b);
      $("#divArvoreAcoes").prepend($(botao));

      mconsole.log("Link adicionado com sucesso.");
    } else {
      mconsole.log("Já existe o botão.")
    }
  }
}


