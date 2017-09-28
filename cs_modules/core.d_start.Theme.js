function Theme(BaseName, theme) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".SetTheme");

  if (document.baseURI.indexOf("acao=editor_montar") == -1) {
    AdicionarLinkCss(document, "seipp-theme", "cs_modules/themes/black.css");
  }
}