/* global ModuleInit, GetBaseUrl, redirecionarPagina, seiVersionCompare, theme */
/** Roda quando a o carregamento do html termina */
const ModNameEnd = 'core.d_end'

/** Pega a versão atual do SEI */
const seiVersion = getSeiVersion(ModNameEnd)

permitirSalvarSenhaBrowser()

ModuleInit(ModNameEnd).then((options) => {
  /** Redireciona para controle de processos */
  if (window.location.href === GetBaseUrl()) {
    redirecionarPagina(ModNameEnd)
  }

  if (options.theme !== 'white') {
    if (options.theme === 'super-black' && seiVersionCompare('>=', '4')) {
      theme(ModNameEnd, options.theme)
    } else if (options.theme === 'black' && seiVersionCompare('<', '4')) {
      theme(ModNameEnd, options.theme)
    }
  }
}).catch(e => console.log(e.message))
