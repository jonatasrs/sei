function Theme(BaseName, tema) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".Theme");

  setTimeout(function () {
    if (document.baseURI.indexOf("acao=editor_montar") == -1 &&
        document.baseURI.indexOf("acao=documento_visualizar") == -1 &&
        document.baseURI.indexOf("acao=base_conhecimento_visualizar") == -1 &&
        document.baseURI.indexOf("acao=documento_imprimir_web") == -1 &&
        document.baseURI.indexOf("acao=bloco_navegar") == -1) {
      AdicionarLinkCss(document, "seipp-theme", "cs_modules/themes/black.css");
      mconsole.log(document.baseURI);
      CorrigirLinkCss();
    }
  }, 10);

  function CorrigirLinkCss(num = 0) {
    setTimeout(function () {
      if (document.getElementsByTagName("body").length == 1) {
        document.getElementsByTagName("head")[0].appendChild(document.getElementById("seipp-theme"));
      } else if (num < 100) {
        CorrigirLinkCss(num + 1);
      }
    }, 10);
  }
}