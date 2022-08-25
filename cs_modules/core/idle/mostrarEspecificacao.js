function MostrarEspecificacao(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".MostrarEspecificacao");
  $detalhado = $("#divTabelaDetalhado").length;
  console.log("Detalhes: " + $detalhado + " ...");
  if ($detalhado > 0) {
    $(".infraTrClara").each(function(index){
      if( $(this).find(".processoVisualizado").length > 0 ) {
        texto = $(this).find(".processoVisualizado").attr("onmouseover");
      }
      if( $(this).find(".processoNaoVisualizado").length > 0) {
        texto = $(this).find(".processoNaoVisualizado").attr("onmouseover");
      }
      var especificacao = texto.substr(28, texto.indexOf(',') - 29);
      $(this).find("td:contains(: )").append("<br /><span style='font-size:11px;'>" + especificacao + "</span>");
    });
  }
  console.log("Tchau");
}