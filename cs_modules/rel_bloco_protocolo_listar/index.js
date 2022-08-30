const BaseName = 'rel_bloco_protocolo_listar'

if (ModuleInit(BaseName, true)) {
  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'pesquisarinformacoes':
        PesquisarInformacoes(BaseName)
        break
      case 'retirarsobrestamentoreabrirembloco':
        RetirarSobrestamentoReabrirEmBloco(BaseName)
        break
      default:
        break
    }
  }, this)
  selecionarMultiplosProcessos(BaseName)
  SelecionarDocumentosAssinar(BaseName)
}
