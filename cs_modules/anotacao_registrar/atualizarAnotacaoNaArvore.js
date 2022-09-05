/* global __mconsole */
function AtualizarAnotacaoNaArvore (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.AtualizarAnotacaoNaArvore')

  $('#divInfraBarraComandosSuperior > button').click(function () {
    mconsole.log('Atualizando...')
    parent.document.getElementById('ifrArvore').contentWindow.location.reload()
  })
}
