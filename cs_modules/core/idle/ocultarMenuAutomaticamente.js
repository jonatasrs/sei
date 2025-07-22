function ocultarMenuAutomaticamente(BaseName) {
  const mconsole = new __mconsole(BaseName + '.ocultarMenuAutomaticamente')
  const menu = document.querySelector('#divInfraAreaTelaE')

  if (menu && menu.classList.contains('infraAreaTelaEExibeGrande')) {
    execOnPage('infraClicarMenuBootstrap()')
    mconsole.log('Menu ocultado automaticamente')
  }
}