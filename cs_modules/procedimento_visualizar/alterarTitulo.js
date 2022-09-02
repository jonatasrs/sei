function AlterarTitulo (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.AlterarTitulo')

  function alterarTitulo () {
    const numeroProcessoEl = document.querySelector('.infraArvore > a[target="ifrVisualizacao"] > span.infraArvoreNoSelecionado')
    if (!numeroProcessoEl) return
    const tipo = numeroProcessoEl.getAttribute('title')
    const numero = numeroProcessoEl.textContent.trim()

    window.parent.document.title = `SEI - ${numero} - ${tipo}`
  }

  ExecutarNaArvore(mconsole, alterarTitulo)
}
