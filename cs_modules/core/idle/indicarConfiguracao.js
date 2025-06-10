/* (ANATEL) Anatel Ponto de controle cores */
function IndicarConfiguracao (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.IndicarConfiguracao')
  const iconSelector = '#lnkConfiguracaoSistema img, #lnkConfiguracaoSistema i, #lnkInfraConfiguracaoSistema img'

  const comp = document.querySelector(iconSelector)
  comp.classList.add('seipp-Indicar-onfiguracao')

  if (document.URL.includes('controlador.php?acao=infra_configurar') && SavedOptions.InstallOrUpdate) {
    SavedOptions.InstallOrUpdate = false
    currentBrowser.storage.local.set(SavedOptions)
    comp.classList.remove('seipp-Indicar-onfiguracao')
    mconsole.log('Animação removida')
  }
}
