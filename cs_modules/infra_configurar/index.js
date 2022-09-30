/* global ModuleInit, optionsUi */
const BaseName = 'infra_configurar'

ModuleInit(BaseName).then((options) => {
  optionsUi(BaseName)
}).catch(e => console.log(e.message))
