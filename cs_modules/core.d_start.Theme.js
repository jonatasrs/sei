function Theme(BaseName, tema) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".Theme");
  var NaoAplicarNestasPaginas = [
    "editor_montar",
    "documento_visualizar",
    "base_conhecimento_visualizar",
    "documento_imprimir_web",
    "bloco_navegar",
    "documento_download_anexo"
  ];

  setTimeout(function () {
    if (AplicarLinkCss()) {
      AdicionarLinkCss(document, "seipp-theme", "cs_modules/themes/black.css");
      mconsole.log(document.baseURI);
      CorrigirLinkCss();
    }
  }, 10);

  function CorrigirLinkCss(num = 0) {
    setTimeout(function () {
      if (document.getElementsByTagName("body").length == 1) {
        try {
          document.getElementsByTagName("head")[0].appendChild(document.getElementById("seipp-theme"));
        } catch (error) {
          alert("ERRO: " + document.baseURI + "\n" + error);
          console.log(error);
        }
      } else if (num < 100) {
        CorrigirLinkCss(num + 1);
      }
    }, 10);
  }

  function AplicarLinkCss() {
    var Aplicar = true;
    NaoAplicarNestasPaginas.forEach(function (item) {
      if (document.baseURI.indexOf("acao=" + item) != -1) {Aplicar = false;}
    });
    return Aplicar;
  }
}