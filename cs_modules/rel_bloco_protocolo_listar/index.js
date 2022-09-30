/* global ModuleInit, PesquisarInformacoes, retirarSobrestamentoReabrirEmBloco,
selecionarMultiplosProcessos, selecionarDocumentosAssinar */
const BaseName = 'rel_bloco_protocolo_listar'

ModuleInit(BaseName).then((options) => {
  options.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'pesquisarinformacoes':
        PesquisarInformacoes(BaseName)
        break
      case 'retirarsobrestamentoreabrirembloco':
        retirarSobrestamentoReabrirEmBloco(BaseName)
        break
      default:
        break
    }
  }, this)
  selecionarMultiplosProcessos(BaseName)
  selecionarDocumentosAssinar(BaseName)
}).catch(e => console.log(e.message))
