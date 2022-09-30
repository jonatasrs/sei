/* global ModuleInit, OrdenarSelect */
const BaseName = 'procedimento_atribuicao_cadastrar'

ModuleInit(BaseName).then((options) => {
  OrdenarSelect(BaseName)
}).catch(e => console.error(e.message))
