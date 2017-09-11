const BaseName = "Seipp.procedimento_visualizar";

SavedOptions.CheckTypes.forEach(function(element) {
  switch (element) {
    case "exibeinfointeressado":
      ConsultarInteressado(BaseName);
      break;
    case "autopreencher":
      AutopreencherAndamento(BaseName);
      break;
    default:
      break;
  }
}, this);
