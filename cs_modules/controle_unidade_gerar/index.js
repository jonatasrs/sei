/* global ModuleInit, retirarSobrestamentoReabrirEmBloco, selecionarMultiplosProcessos */
const BaseName = 'controle_unidade_gerar'

ModuleInit(BaseName).then((options) => {
  options.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'retirarsobrestamentoreabrirembloco':
        retirarSobrestamentoReabrirEmBloco(BaseName)
        break
      default:
        break
    }
  }, this)
  selecionarMultiplosProcessos(BaseName)
}).catch(e => console.log(e.message))
