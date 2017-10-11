const BaseName = "procedimento_visualizar";

if (ModuleInit(BaseName)) {
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
}