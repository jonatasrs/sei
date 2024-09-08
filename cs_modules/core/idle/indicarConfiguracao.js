/* (ANATEL) Anatel Ponto de controle cores */
function IndicarConfiguracao (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.IndicarConfiguracao')
  const iconSelector = '#lnkConfiguracaoSistema img, #lnkConfiguracaoSistema i'

  $(iconSelector).css({
    animation: 'rotation 2s infinite linear',
    padding: '0px',
    borderRadius: '7px'
  })

  if (document.URL.includes('controlador.php?acao=infra_configurar') && SavedOptions.InstallOrUpdate) {
    SavedOptions.InstallOrUpdate = false
    currentBrowser.storage.local.set(SavedOptions)
    $(iconSelector).css({ animation: 'none' })
    mconsole.log('Animação removida')
  }
}
