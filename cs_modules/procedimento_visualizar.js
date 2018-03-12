const BaseName = "procedimento_visualizar";

function ExecutarNaArvore(Modlog, func) {
  EsperaCarregar(Modlog, "#divArvore > div", "a[target='ifrVisualizacao']", function () {
    func();
    $("#divArvore > div > div:hidden").each(function () {
      var idPasta = $(this).attr("id").substr(3);
      Modlog.log(idPasta + " -> evento click adicionado.");
      $("#ancjoin" + idPasta).click(function () {
        EsperaCarregar(Modlog, "#div" + idPasta, "a[target='ifrVisualizacao']", func);
        $(this).off("click");
      });
    });
  });
}

if (ModuleInit(BaseName)) {
  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case "exibeinfointeressado":
        ConsultarInteressado(BaseName);
        break;
      case "autopreencher":
        AutopreencherAndamento(BaseName);
        break;
      case "copiarnumeroprocessodocumento":
        CopiarNumeroProcessoDocumento(BaseName);
        break;
      case "mostraranotacao":
        MostrarAnotacao(BaseName);
        break;
      default:
        break;
    }
  }, this);
  AbrirDocumentoNovaAba(BaseName);
}

