/* global ModuleInit, SavedOptions, retirarSobrestamentoReabrirEmBloco, selecionarMultiplosProcessos */
const BaseName = 'controle_unidade_gerar'

if (ModuleInit(BaseName, true)) {
  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'retirarsobrestamentoreabrirembloco':
        retirarSobrestamentoReabrirEmBloco(BaseName)
        break
      default:
        break
    }
  }, this)
  selecionarMultiplosProcessos(BaseName)
}
