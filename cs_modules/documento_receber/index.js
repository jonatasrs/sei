const BaseName = 'documento_receber'

if (ModuleInit(BaseName)) {
  ForcarReaberturaProcesso(BaseName)

  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'cliquemenos':
        autopreencherDocumentoExterno(BaseName, SavedOptions)
        break
      default:
        break
    }
  }, this)
}
