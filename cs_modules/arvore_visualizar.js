const BaseName = "arvore_visualizar";

SavedOptions.CheckTypes.forEach(function(element) {
  switch (element) {
    case "atalhonovodoc":
      NovoDocumento(BaseName);
      break;
    default:
      break;
  }
}, this);
