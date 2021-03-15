const BaseName = "procedimento_controlar";

if (ModuleInit(BaseName, true)) {
  CorrigirTabelas(BaseName);

  // CEPESC:
  addTabs(BaseName);

  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case "prazo":
      case "qtddias":
        IncluirCalculoPrazos(BaseName, element);
        break;
      case "marcarcorprocesso":
        MarcarCorProcesso(BaseName);
        break;
      case "filtraporatribuicao":
        FiltraPorAtribuicao(BaseName);
        break;
      case "carregainformacaoblocos":
        CarregaInformacaoBlocos(BaseName);
        break;
      case "pesquisarinformacoes":
        PesquisarInformacoes(BaseName);
        break;
      // CEPESC:
      case "especificacao":
        IncluirEspecificacao(BaseName);
        break;
      case "tipo":
        IncluirTipo(BaseName);
        break;
      default:
        break;
    }
  }, this);
  AdicionarOrdenacao(BaseName);
  SelecionarMultiplosProcessos(BaseName);
  ConfirmarAntesConcluir(BaseName);
  OrdenarColunas(BaseName);
}