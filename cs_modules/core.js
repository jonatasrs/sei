/*** Configurações do sistema *************************************************/
/** Opção padrão caso não exista opções salvas. */
var DefaultOptions = {
  theme: "white",
  CheckTypes: [
    "prazo"
  ]};

/** Options salvas */
var SavedOptions = DefaultOptions;

/*** Verifica se está utilizando o navegador chrome ***************************/
const isChrome = (typeof browser === "undefined"); /* Chrome: */
if (isChrome) {var browser = chrome;} /* Chrome: */

/*** Url base do sei ***********************************************************/
function GetBaseUrl() {
  return window.location.protocol + "//" + window.location.hostname + "/sei/";
}

/*** MODULES: Generic class log ************************************************/
var __mconsole = function (ModuleName)
{
  this.ModuleName = ModuleName;
  console.log(this.ModuleName + ": Loading...");
}
__mconsole.prototype.log = function(message){
  console.log(this.ModuleName + ": " + message);
};

/*** Biblioteca de strings *****************************************************/

/** Adiciona a mascara de CPF/CNPJ. */
function format_cpf(cpf) {
  var mask = cpf;

  if (cpf.length == 11) {
    mask = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cpf.length == 14) {
    mask = cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5");
  } else mask = "";
  return mask;
}
