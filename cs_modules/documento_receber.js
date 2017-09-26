const BaseName = "Seipp.documento_receber";

if (ModuleInit(BaseName)) {

  SavedOptions.CheckTypes.forEach(function(element) {
    switch (element) {
      case "cliquemenos":
        AutopreencherDocumentoExterno(BaseName, SavedOptions);
        break;
      default:
        break;
    }
  }, this);
}