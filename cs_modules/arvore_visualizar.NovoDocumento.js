function NovoDocumento(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".NovoDocumento");

  /* Verifica se já tem o botão de novo documento */
  var havenewdoc = $('#divArvoreAcoes a[href*="acao=documento_escolher_tipo"]').length;
  var havenewdocp = $('#divArvoreAcoes a[href*="acao=documento_receber"]').length;

  /* Se não tiver o botão faz */
  if (!havenewdoc && !havenewdocp) {
    /* Pega o head do html */
    var b = 0;
    var botao = "";
    var head =$(parent.document.getElementById('ifrArvore').contentWindow.document.head).html();
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
    //$("#seipp_newdoc").attr("href", botao);
    mconsole.log("Link adicionado com sucesso.");
  } else {
    mconsole.log("Já existe o botão.")
  }
}


