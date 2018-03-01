//AtalhoPublicacoesEletronicas
function AtalhoPublicacoesEletronicas(BaseName) {
  var mconsole = new __mconsole(BaseName + ".AtalhoPublicacoesEletronicas");

  // Verifica se o link existe.
  var url = "publicacoes/controlador_publicacoes.php?acao=publicacao_pesquisar&id_orgao_publicacao=0";
  var txtitle = "Publicações Eletrônicas";

  $.ajax({ url: GetBaseUrl() + url }).done(function () { AdicionarAtalho(); })
    .fail(function () { mconsole.log("Página de publicações não existe"); });

  function AdicionarAtalho() {
    $("#divInfraBarraSistemaD").prepend($("<div/>")
      .addClass("infraAcaoBarraSistema")
      .append($("<a>")
        .attr("href", url)
        .attr("title", txtitle)
        .attr("style", $("#lnkAjuda").attr("style"))
        .attr("target", "_blank")
        .text(txtitle)
      )
    );
  }
}