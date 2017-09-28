/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo / Diego Rossi / Hebert M. Magalhães
*******************************************************************************/
const BaseName = "Seipp.core.d_idle";

console.log(BaseName);

if (ModuleInit(BaseName)) {

  AdicionarIdentificadorSeipp(BaseName);

  SavedOptions.CheckTypes.forEach(function(element) {
    switch (element) {
      case "chkbloco":
        VerificarBlocoAssinatura(BaseName);
        break;
      case "menususp":
        MenuSuspenso(BaseName);
        break;
      default:
        break;
    }
  }, this);
}
