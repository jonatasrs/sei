/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo / Diego Rossi / Hebert M. Magalhães
*******************************************************************************/
const ModName_idle = 'core.d_idle'

ModuleInit(ModName_idle).then((options) => {
  AdicionarIdentificadorSeipp(ModName_idle)

  moveMenu()
  ocultarMenuAutomaticamente()

  options.CheckTypes.forEach(function (element) {
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
        atalhoPublicacoesEletronicas(ModName_idle)
        break
      case 'link_neutro_controle_processos':
        linkNeutroControleProcessos(ModName_idle)
        break
      default:
        break
    }
  }, this)

  if (options.InstallOrUpdate) IndicarConfiguracao(ModName_idle)
}).catch(e => console.log(e.message))
