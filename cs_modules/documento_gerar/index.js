/* global ModuleInit, GerarDocumentoComModelo */
const BaseName = 'documento_gerar'

ModuleInit(BaseName).then((options) => {
  if (options.usardocumentocomomodelo) {
    GerarDocumentoComModelo(BaseName)
  }
}).catch(e => console.log(e.message))
