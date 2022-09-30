/* global ModuleInit, AtualizarAnotacaoNaArvore */
const BaseName = 'anotacao_registrar'

ModuleInit(BaseName).then((options) => {
  options.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'mostraranotacao':
        AtualizarAnotacaoNaArvore(BaseName)
        break
      default:
        break
    }
  }, this)
}).catch(e => console.error(e.message))
