/* global __mconsole, RemoveAllOldEventListener */
function confirmarAntesConcluir (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.ConfirmarAntesConcluir')
  const selectors = '#divComandos>a[onClick*="controlador.php?acao=procedimento_concluir"]'
  const botao = document.querySelector(selectors)

  if (botao) {
    const action = botao.getAttribute('onclick')
    const newAction = `
      if (acaoPendenciaMultipla(true) && confirm('Deseja mesmo concluir os processos selecionados?')) {
        ${action}
      }
    `
    botao.setAttribute('onclick', newAction)

    RemoveAllOldEventListener(selectors)
    mconsole.log('Evento click ajustado.')
  } else {
    mconsole.log('Botão não encontrado.')
  }
}
