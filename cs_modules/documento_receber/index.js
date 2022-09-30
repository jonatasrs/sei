/* global ModuleInit, forcarReaberturaProcesso, autopreencherDocumentoExterno */
const BaseName = 'documento_receber'

ModuleInit(BaseName).then((options) => {
  forcarReaberturaProcesso(BaseName)

  options.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'cliquemenos':
        autopreencherDocumentoExterno(BaseName, options)
        break
      default:
        break
    }
  }, this)
}).catch(e => console.log(e.message))
