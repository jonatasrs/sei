/* global AdicionarIdentificadorSeipp, ocultarMenuAutomaticamente,
  VerificarBlocoAssinatura, moveLinkMenu, PontoControleCores,
  atalhoPublicacoesEletronicas, linkNeutroControleProcessos,
  IndicarConfiguracao, ModuleInit */
/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo / Diego Rossi / Hebert M. Magalhães
*******************************************************************************/
const ModNameIdle = 'core.d_idle'

ModuleInit(ModNameIdle).then((options) => {
  AdicionarIdentificadorSeipp(ModNameIdle)

  ocultarMenuAutomaticamente()

  options.CheckTypes.forEach(function (element) {
    switch (element) {
      case 'chkbloco':
        VerificarBlocoAssinatura(ModNameIdle)
        break
      case 'move_link_menu':
        moveLinkMenu(ModNameIdle)
        break
      case 'pontocoresanatel':
        PontoControleCores(ModNameIdle)
        break
      case 'atalhopublicacoeseletronicas':
        atalhoPublicacoesEletronicas(ModNameIdle)
        break
      case 'link_neutro_controle_processos':
        linkNeutroControleProcessos(ModNameIdle)
        break
      default:
        break
    }
  }, this)

  if (options.InstallOrUpdate) IndicarConfiguracao(ModNameIdle)
}).catch(e => console.log(e.message))
