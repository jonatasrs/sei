function AbrirDocumentoNovaAba(BaseName) {
  var mconsole = new __mconsole(BaseName + ".AbrirDocumentoNovaAba");
  var script = "var id = $(this).attr('id').substr(4); if (event.ctrlKey) { $(this).parent().attr('href', objArvore.getNo(id).src); } else { $(this).parent().attr('href', objArvore.getNo(id).href); }"

  function Executar() {
    $("#divArvore > div a[target='ifrVisualizacao'] > span").each(function () {
      if ($(this).attr("onclick") == undefined) {
        $(this).attr("onclick", script);
      }
    });
  }

  ExecutarNaArvore(mconsole, Executar);
}