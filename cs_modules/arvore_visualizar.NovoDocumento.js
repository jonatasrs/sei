function NovoDocumento(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".NovoDocumento");

  /* Pega a url de inclusão de documento */
  var havenewdoc = $('#divArvoreAcoes a[href*="acao=documento_escolher_tipo"]').length;
  if (havenewdoc < 1) {
    var head =$(parent.document.getElementById('ifrArvore').contentWindow.document.head).html()
    var a = head.indexOf("controlador.php?acao=documento_escolher_tipo");
    var b = 0;
    var url = "";

    /*** Adiciona item novo documento */
    if (a != -1) {
      b = head.indexOf("\"", a);
      url = head.substring(a, b);
      $("#divArvoreAcoes").prepend("<a id='seipp_newdoc' tabindex='451' class='botaoSEI'><img class='infraCorBarraSistema' src='imagens/sei_incluir_documento.gif' alt='Incluir Documento' title='Incluir Documento'></a>");
      $("#seipp_newdoc").attr("href", url);
      mconsole.log("Link adicionado com sucesso.");
    } else {
      mconsole.log("Link não encontrado.");
    }
  }
}


