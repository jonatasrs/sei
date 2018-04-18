function CopiarLinkInterno(BaseName) {
  var mconsole = new __mconsole(BaseName + ".CopiarLinkInterno");
  var linkurl = GetBaseUrl() + "controlador.php?acao=procedimento_trabalhar&id_procedimento=";
  var idmod = "seipp-cli";

  ExecutarNaArvore(mconsole, Iniciar);

  function Iniciar(params) {
    $("#divArvore > a[target='ifrVisualizacao']:has(span)").each(function () {
      let id = $(this).find("span").attr("id").substr(4);
      let $imgCopyLink = $("<img/>");
      if ($("#" + idmod + id).length != 0) return;

      mconsole.log(" + : " + id);
      $imgCopyLink
        .attr("id", idmod + id)
        .attr("title", "Copiar Link Interno para Processo/Documento")
        .attr("src", browser.extension.getURL("icons/link.png"))
        .on("click", function () {
          var $copy = $("<input>");
          $("body").append($copy);
          $copy.val(linkurl + id).select();
          try {
            document.execCommand("copy");
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