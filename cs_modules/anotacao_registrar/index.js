/* global ModuleInit, SavedOptions, AtualizarAnotacaoNaArvore */
const BaseName = 'anotacao_registrar'

if (ModuleInit(BaseName)) {
  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'mostraranotacao':
        AtualizarAnotacaoNaArvore(BaseName)
        break
      default:
        break
    }
  }, this)
}
