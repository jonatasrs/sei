const BaseName = 'arvore_visualizar'

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
