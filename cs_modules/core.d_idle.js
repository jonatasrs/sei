/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo / Diego Rossi / Hebert M. Magalhães
*******************************************************************************/
const ModName_idle = "Seipp.core.d_idle";

if (ModuleInit(ModName_idle)) {
  AdicionarIdentificadorSeipp(ModName_idle);

  SavedOptions.CheckTypes.forEach(function(element) {
    switch (element) {
      case "chkbloco":
        VerificarBlocoAssinatura(ModName_idle);
        break;
      case "menususp":
        MenuSuspenso(ModName_idle);
        break;
      default:
        break;
    }
  }, this);
}
