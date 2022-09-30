/* global ModuleInit, corrigirTabelas, incluirCalculoPrazos, marcarCorProcesso,
FiltraPorAtribuicao, carregaInformacaoBlocos, PesquisarInformacoes, ListaPorEspecificacao,
mostrarEspecificacao, seiVersionCompare, addScriptToPage, selecionarMultiplosProcessos,
confirmarAntesConcluir */
const BaseName = 'procedimento_controlar'

ModuleInit(BaseName).then((options) => {
  corrigirTabelas(BaseName)
  options.CheckTypes.forEach(function (element) {
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
        carregaInformacaoBlocos(BaseName)
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

  if (seiVersionCompare('<', '4')) {
    /* Ao invés de injetar este script, carregá-lo via script tag,
      para que seja acessível pelas funções cujo contexto é a página, e não a extensão. */
    addScriptToPage('lib/jquery.tablesorter/jquery.tablesorter.min.js')
    addScriptToPage('lib/jquery.tablesorter/jquery.tablesorter.widgets.min.js')

    /* Ao invés de injetar o adicionarOrdenacao, carregá-lo no contexto da página */
    addScriptToPage(
      'cs_modules/procedimento_controlar/adicionarOrdenacao.js',
      `adicionarOrdenacao('${BaseName}');`
    )
  }

  selecionarMultiplosProcessos(BaseName)
  confirmarAntesConcluir(BaseName)
}).catch(e => console.error(e.message))
