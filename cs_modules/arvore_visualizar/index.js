/* global seiVersionCompare, novoDocumento */
const BaseName = 'arvore_visualizar'

ModuleInit(BaseName).then((options) => {
  options.CheckTypes.forEach(function (element) {
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
}).catch(e => console.error(e.message))
