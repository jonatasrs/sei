const BaseName = "documento_receber";

if (ModuleInit(BaseName)) {
  ForcarReaberturaProcesso(BaseName);

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