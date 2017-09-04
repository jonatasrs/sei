const BaseName = "Seipp.procedimento_visualizar";

SavedOptions.CheckTypes.forEach(function(element) {
  switch (element) {
    case "atalhonovodoc":
      NovoDocumento(BaseName);
      break;
    case "exibeinfointeressado":
      ConsultarInteressado(BaseName);
      break;
    default:
      break;
  }
}, this);
