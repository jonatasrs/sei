/** Roda quando a o carregamento do html termina */
const ModNameEnd = 'core.d_end'

function mainModEnd () {
  Init(ModNameEnd)

  /** Redireciona para controle de processos */
  if (window.location.href === GetBaseUrl()) {
    redirecionarPagina(ModName_start)
  }

  if (SavedOptions.theme !== 'white') {
    if (SavedOptions.theme === 'super-black' && seiVersionCompare('>=', '4')) {
      theme(ModNameEnd, SavedOptions.theme)
    } else if (SavedOptions.theme === 'black' && seiVersionCompare('<', '4')) {
      theme(ModNameEnd, SavedOptions.theme)
    }
  }
}

/** Pega a versão atual do SEI */
const seiVersion = getSeiVersion(ModNameEnd)

mainModEnd()
