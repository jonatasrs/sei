function PontoControleCores(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".PontoControleCores");
  var AplicarNestasPaginas = [
    "procedimento_visualizar",
    "procedimento_controlar"
  ];

  if (AplicarLinkCss()) {
    mconsole.log(document.baseURI);
    AdicionarLinkCss(document, "seipp-pontocores-anatel", "cs_modules/themes/PontoControleCores_Anatel.css");
  }

  function AplicarLinkCss() {
    var Aplicar = false;
    AplicarNestasPaginas.forEach(function (item) {
      if (document.baseURI.indexOf("acao=" + item) != -1) { Aplicar = true; }
    });
    return Aplicar;
  }
}
