function AbrirDocumentoNovaAba(BaseName) {
  var mconsole = new __mconsole(BaseName + ".AbrirDocumentoNovaAba");

  function Executar() {
    $("#divArvore > div a[target='ifrVisualizacao']").each(function () {
      var href = $(this).attr("href");
      mconsole.log(href);

      $(this).click(function (event) {
        if (!event.ctrlKey) {
          $(this).attr("href", href);
        } else {
          var id = $(this).attr("id").substr(6);
          var html = $("head").html();
          var a, b, url;

          a = html.indexOf("controlador.php?acao=documento_visualizar&acao_origem=procedimento_visualizar&id_documento=" + id);
          mconsole.log(a);
          if (a == -1) {
            a = html.indexOf("infraArvoreNo(\"DOCUMENTO\",\"" + id);
            if (a != -1) {
              a = html.indexOf("controlador.php?acao=documento_download_anexo&acao_origem=procedimento_visualizar&id_anexo", a);
            } else {
              return;
            }
          }
          b = html.indexOf("'", a);
          url = html.substring(a, b);
          $(this).attr("href", url);
        }
      });
    });
  }

  setTimeout(Executar, 400);
}