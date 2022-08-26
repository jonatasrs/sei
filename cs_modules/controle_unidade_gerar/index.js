const BaseName = "controle_unidade_gerar";

if (ModuleInit(BaseName, true)) {
  SavedOptions.CheckTypes.forEach(function(element) {
    switch (element) {
      case "retirarsobrestamentoreabrirembloco":
    	  RetirarSobrestamentoReabrirEmBloco(BaseName);
          break;
      default:
        break;
    }
  }, this);
  SelecionarMultiplosProcessos(BaseName);
}