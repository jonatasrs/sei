/* global __mconsole */
function AumentaTamanho (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.AumentaTamanho')
  document.getElementById('txtProtocoloDocumentoTextoBase').maxLength = 11
  mconsole.log('Aumentado para 11')
}
