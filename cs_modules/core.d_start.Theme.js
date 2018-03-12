function Theme(BaseName, tema) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".Theme");
  var NaoAplicarNestasPaginas = [
    "editor_montar",
    "documento_visualizar",
    "base_conhecimento_visualizar",
    "documento_imprimir_web",
    "bloco_navegar",
    "documento_download_anexo",
    "procedimento_paginar"
  ];

  setTimeout(function () {
    if (AplicarLinkCss()) {
      AdicionarLinkCss(document, "seipp-theme", "cs_modules/themes/black.css");
      mconsole.log(document.baseURI);
      CorrigirLinkCss(document, "seipp-theme");
    }
  }, 10);

  /** Adicionar link css na página */
  function CorrigirLinkCss(doc, id, num = 0) {
    setTimeout(function () {
      var head = doc.getElementsByTagName('head')[0];
      if (head == undefined) return;
      /* Sai se for o CKEditor */
      var htitle = head.getElementsByTagName('title')[0];
      if (htitle != undefined) { if (htitle.getAttribute('data-cke-title') != undefined) return; }
      if (doc.getElementsByTagName("body").length == 1) {
        try {
          head.appendChild(doc.getElementById(id));
        } catch (error) {
          alert("ERRO: " + doc.baseURI + "\n" + error);
          console.log(error);
        }
      } else if (num < 100) {
        CorrigirLinkCss(doc, id, num + 1);
      }
    }, 10);
  }

  function AplicarLinkCss() {
    var Aplicar = true;
    NaoAplicarNestasPaginas.forEach(function (item) {
      if (document.baseURI.indexOf("acao=" + item) != -1) { Aplicar = false; }
    });
    return Aplicar;
  }
}