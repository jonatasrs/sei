/* global __mconsole, EsperaCarregar */
// eslint-disable-next-line no-unused-vars
function AlterarTitulo (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.AlterarTitulo')

  function alterarTitulo () {
    const numeroProcessoEl = document.querySelector('.infraArvore > a[target="ifrVisualizacao"]')
    if (!numeroProcessoEl) return
    const tipo = numeroProcessoEl.getAttribute('title')
    const numero = numeroProcessoEl.textContent.trim()

    window.parent.document.title = `SEI - ${numero} - ${tipo}`
  }

  EsperaCarregar(mconsole, 'body.infraArvore', "a[target$='Visualizacao']", alterarTitulo)
}
