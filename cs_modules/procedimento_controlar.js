const BaseName = "Seipp.procedimento_controlar";

AdicionarOrdenacao(BaseName);

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