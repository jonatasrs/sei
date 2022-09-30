/* global ModuleInit, EscolherDocumentoComModelo */
const BaseName = 'documento_escolher_tipo'

ModuleInit(BaseName).then((options) => {
  if (options.usardocumentocomomodelo) {
    EscolherDocumentoComModelo(BaseName)
  }
}).catch(e => console.log(e.message))
