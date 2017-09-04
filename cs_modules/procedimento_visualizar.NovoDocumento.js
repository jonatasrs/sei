function NovoDocumento(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".NovoDocumento");

  /* Pega a url de inclusão de documento */
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=documento_escolher_tipo");
  var b = 0;
  var url = "";

  if (a != -1) {
    b = head.indexOf("\"", a);
    url = head.substring(a, b);
    $("#divConsultarAndamento").after("<div id='seipp_novodoc'/>");
    $("#seipp_novodoc").append(
      "<a id='seipp_link_novodoc' target='ifrVisualizacao' href='" + url +
      "'>");
    $("#seipp_link_novodoc").append(
      "<img class='infraImg infraCorBarraSistema' \
      src='imagens/sei_incluir_documento.gif' \
      alt='Incluir Documento' title='Incluir Documento'/>");
    $("#seipp_link_novodoc").append("<span>Incluir Documento</span>");
    mconsole.log("Link adicionado com sucesso.");
  } else {
    mconsole.log("Link não encontrado.");
  }
}


