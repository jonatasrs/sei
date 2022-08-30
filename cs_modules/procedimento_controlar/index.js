const BaseName = 'procedimento_controlar'

if (ModuleInit(BaseName, true)) {
  corrigirTabelas(BaseName)
  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'prazo':
      case 'qtddias':
        incluirCalculoPrazos(BaseName, element)
        break
      case 'marcarcorprocesso':
        marcarCorProcesso(BaseName)
        break
      case 'filtraporatribuicao':
        FiltraPorAtribuicao(BaseName)
        break
      case 'carregainformacaoblocos':
        CarregaInformacaoBlocos(BaseName)
        break
      case 'pesquisarinformacoes':
        PesquisarInformacoes(BaseName)
        break
      case 'especificacaoresumida':
        ListaPorEspecificacao(BaseName)
        break
      case 'especificacao':
        mostrarEspecificacao(BaseName)
        break
      default:
        break
    }
  }, this)

  /* Ao invés de injetar este script, carregá-lo via script tag,
    para que seja acessível pelas funções cujo contexto é a página, e não a extensão. */
  addScriptToPage('lib/jquery.tablesorter/jquery.tablesorter.min.js')
  addScriptToPage('lib/jquery.tablesorter/jquery.tablesorter.widgets.min.js')

  /* Ao invés de injetar o adicionarOrdenacao, carregá-lo no contexto da página */
  addScriptToPage(
    'cs_modules/procedimento_controlar/adicionarOrdenacao.js',
    `adicionarOrdenacao('${BaseName}');`
  )

  SelecionarMultiplosProcessos(BaseName)
  confirmarAntesConcluir(BaseName)
}
