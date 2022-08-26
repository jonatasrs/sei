/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo / Diego Rossi / Hebert M. Magalhães
*******************************************************************************/
const ModName_idle = 'core.d_idle'

if (ModuleInit(ModName_idle)) {
  AdicionarIdentificadorSeipp(ModName_idle)
  SavedOptions.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'chkbloco':
        VerificarBlocoAssinatura(ModName_idle)
        break
      case 'menususp':
        if (seiVersionCompare('<', '4.0.0.0')) {
          MenuSuspenso(ModName_idle)
        }
        break
      case 'pontocoresanatel':
        PontoControleCores(ModName_idle)
        break
      case 'atalhopublicacoeseletronicas':
        AtalhoPublicacoesEletronicas(ModName_idle)
        break
      case 'no_buttons':
        NoButtons(ModName_idle)
        break
      default:
        break
    }
  }, this)

  if (SavedOptions.InstallOrUpdate) IndicarConfiguracao(ModName_idle)
}
