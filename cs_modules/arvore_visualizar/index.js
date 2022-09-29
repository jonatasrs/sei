/* global SavedOptions, seiVersionCompare, novoDocumento */
const BaseName = 'arvore_visualizar'

if (ModuleInit(BaseName)) {
  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'atalhonovodoc':
        if (seiVersionCompare('<', '4')) {
          novoDocumento(BaseName)
        }
        break
      default:
        break
    }
  }, this)
}
