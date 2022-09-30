/* global ModuleInit, optionsUi */
const BaseName = 'infra_configurar'

ModuleInit(BaseName).then((options) => {
  optionsUi(BaseName)
}).catch(e => console.error(e.message))
