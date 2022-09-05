/** Redireciona pagina para controle de processos */
function redirecionarPagina (BaseName, num = 0) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.RedirecionarPagina')
  const { href } = document.querySelector('a[href^="controlador.php?acao=procedimento_controlar"]')
  if (href) {
    window.location.href = href
    mconsole.log('Redirecionada para controle de processos.')
  }
}
