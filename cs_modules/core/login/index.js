async function limparConfiguracao (BaseName) {
  const mconsole = new __mconsole(BaseName + '.limparConfiguracao')

  await currentBrowser.storage.local.remove('linkNeutroControleProcessos')
  mconsole.log('Configuração limpa')
}

const ModName_idle = 'core.login'

ModuleInit(ModName_idle).then((options) => {
  options.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'link_neutro_controle_processos':
        limparConfiguracao(ModName_idle)
        break
      default:
        break
    }
  }, this)
}).catch(e => console.log(e.message))