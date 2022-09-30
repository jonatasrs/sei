/* global __mconsole, SavedOptions */
function marcarCorProcesso (BaseName) {
  /** inicialização do módulo */

  const mconsole = new __mconsole(BaseName + '.marcarCorProcesso')

  incluirCorTabela('#tblProcessosDetalhado')
  incluirCorTabela('#tblProcessosGerados')
  incluirCorTabela('#tblProcessosRecebidos')

  function incluirCorTabela (IdTabela) {
    const rows = document.querySelectorAll(`${IdTabela}>tbody>tr`)

    rows.forEach(row => {
      const processo = row.querySelector('.processoVisualizado, .processoNaoVisualizado')
      const cor = escolherCor(processo)
      mconsole.log(`${processo.innerText} - ${cor}`)
      formatarTabela(processo, cor)
    })
  }

  function escolherCor (processo) {
    const confCores = SavedOptions.ConfiguracoesCores
    const texto = processo.getAttribute('onmouseover')
    const especificacao = texto.substring(texto.indexOf('(\'') + 2, texto.indexOf(')') - 1).toLowerCase()

    return confCores.reduce((p, c) => {
      return !p && c.valor && especificacao.includes(c.valor.toLowerCase())
        ? c.cor
        : p
    }, '')
  }

  /* Formata a tabela pelos valores */
  function formatarTabela (processo, cor) {
    if (cor) {
      processo.setAttribute('style', 'background-color: ' + cor + '; padding: 0 1em 0 1em')
    }
  }
}
