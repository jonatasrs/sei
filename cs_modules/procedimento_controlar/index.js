/* global ModuleInit, corrigirTabelas, incluirCalculoPrazos, marcarCorProcesso,
FiltraPorAtribuicao, carregaInformacaoBlocos, PesquisarInformacoes, ListaPorEspecificacao,
mostrarEspecificacao, selecionarMultiplosProcessos,
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

  selecionarMultiplosProcessos(BaseName)
  confirmarAntesConcluir(BaseName)
}).catch(e => console.log(e.message))
