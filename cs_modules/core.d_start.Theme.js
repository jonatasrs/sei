function Theme(BaseName, tema, num = 0) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".Theme");

  if (document.baseURI.indexOf("acao=editor_montar") == -1) {
    setTimeout(function () {
      mconsole.log(document.getElementsByTagName("body").length);
      if (document.getElementsByTagName("body").length == 1) {
        mconsole.log(num);
        AdicionarLinkCss(document, "seipp-theme", "cs_modules/themes/black.css");
      } else if (num < 100) {
        Theme(BaseName, tema, num + 1);
      } else {
        mconsole.log("Erro ao aplicar o tema!");
      }
    }, 100);
  }
}