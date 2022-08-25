/** Roda quando a o carregamento do html termina */
const ModNameEnd = 'core.d_end'
Init(ModNameEnd)

/** Pega a versão atual do SEI */
const seiVersion = getSeiVersion(ModNameEnd)

/** Redireciona para controle de processos */
if (window.location.href === GetBaseUrl()) redirecionarPagina(ModName_start)
