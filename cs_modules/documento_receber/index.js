/* global ModuleInit, ForcarReaberturaProcesso, autopreencherDocumentoExterno */
const BaseName = 'documento_receber'

ModuleInit(BaseName).then((options) => {
  ForcarReaberturaProcesso(BaseName)

  options.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'cliquemenos':
        autopreencherDocumentoExterno(BaseName, options)
        break
      default:
        break
    }
  }, this)
}).catch(e => console.error(e.message))
