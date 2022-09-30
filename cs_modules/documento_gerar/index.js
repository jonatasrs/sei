/* global ModuleInit, GerarDocumentoComModelo, AumentaTamanho */
const BaseName = 'documento_gerar'

ModuleInit(BaseName).then((options) => {
  if (options.usardocumentocomomodelo) {
    GerarDocumentoComModelo(BaseName)
  }
  AumentaTamanho(BaseName)
}).catch(e => console.error(e.message))
