// injectedScript.js
// Com o novo ManifestV3 codigo arbitrario inline nao pode ser executado
function __mconsole(ModuleName) {
  this.PModuleName = ModuleName;
  console.log("[Seipp " + Date.now() + "]  " + this.PModuleName + ": Loading...");
}
__mconsole.prototype.log = function(message) {
  console.log("[Seipp " + Date.now() + "]    "+ this.PModuleName+": " + message);
}
