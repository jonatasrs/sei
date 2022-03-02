function CopiarLinkInterno (BaseName) {
  var mconsole = new __mconsole(BaseName + ".CopiarLinkInterno");
  var linkurl = GetBaseUrl() + "controlador.php?acao=procedimento_trabalhar&id_procedimento=";
  var idmod = "seipp-cli";

  ExecutarNaArvore(mconsole, Iniciar);

  function Iniciar (params) {
    let idProcesso = null
    let arvore = $("#divArvore > a[target='ifrVisualizacao']:has(span)")
    if (!arvore.length) {
      arvore = $(".infraArvore > a[target='ifrVisualizacao']:has(span)")
    }
    arvore.each(function () {
      let id = $(this).find("span").attr("id").substr(4);
      let hasDocumento = this.href.indexOf('documento') > 0
      let $imgCopyLink = $("<img/>");
      if ($("#" + idmod + id).length != 0) return;

      if (!hasDocumento) { idProcesso = id }

      mconsole.log(" + : " + id);
      $imgCopyLink
        .attr("id", idmod + id)
        .attr("title", "Copiar Link Interno para Processo/Documento")
        .attr("src", browser.runtime.getURL("icons/link.png"))
        .on("click", function () {
          var $copy = $("<input>");
          $("body").append($copy);
          $copy.val(linkurl + (hasDocumento ? idProcesso + '&id_documento=' : '') + id).select();
          try {
            document.execCommand("copy");
            AnimacaoFade(this);
          } catch (error) {
            alert("Erro ao copiar o link!");
          }
          $copy.remove();
          mconsole.log("copiar link: " + id);
        });
      $(this).after($imgCopyLink).after('<img src="/infra_css/imagens/espaco.gif">');
    });
  }
}
