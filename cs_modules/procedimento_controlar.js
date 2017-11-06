const BaseName = "procedimento_controlar";

if (ModuleInit(BaseName, true)) {
  CorrigirTabelas(BaseName);
  SavedOptions.CheckTypes.forEach(function(element) {
    switch (element) {
      case "prazo":
      case "qtddias":
        IncluirCalculoPrazos(BaseName, element);
        break;
      default:
        break;
    }
  }, this);
  AdicionarOrdenacao(BaseName);
}