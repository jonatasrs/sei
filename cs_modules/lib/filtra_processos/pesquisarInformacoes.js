/* global __mconsole, filtrarTabela, removerFiltroTabela */
// eslint-disable-next-line no-unused-vars
function PesquisarInformacoes (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.PesquisarInformacoes')
  const arrayTabela = []

  const classeFiltro = 'PorPesquisa'
  const regexPesquisaOu = /^\[(.+)\]$/

  $('div.infraAreaTabela table').each(function (indexTabela, itemTabela) {
    const tabela = $(itemTabela)
    arrayTabela.push(tabela)
  })

  $(document.getElementById('txtPesquisaRapida')).on('input change', function () {
    let pesquisaGrupo = false
    let arrayTermo
    const texto = this.value.toLowerCase()

    if (texto) {
      if (regexPesquisaOu.test(texto)) {
        arrayTermo = texto.substring(1, texto.length - 1).match(/\S+/g)
        pesquisaGrupo = true
      } else {
        arrayTermo = [texto]
      }
    } else {
      arrayTermo = []
    }

    const termosEncontrados = []

    arrayTabela.forEach(function (tabela) {
      if (arrayTermo.length) {
        filtrarTabela(tabela, null, classeFiltro, function (indexTr, tr) {
          const textoTr = tr.innerHTML.toLowerCase()
          for (let i = 0; i < arrayTermo.length; i++) {
            if (textoTr.indexOf(arrayTermo[i]) !== -1) {
              if (termosEncontrados.indexOf(arrayTermo[i]) === -1) { termosEncontrados.push(arrayTermo[i]) }
              return true
            }
          }
          return false
        })
      } else {
        removerFiltroTabela(tabela, null, classeFiltro)
      }
    })

    if (pesquisaGrupo) {
      for (let i = 0; i < arrayTermo.length; i++) {
        if (termosEncontrados.indexOf(arrayTermo[i]) === -1) { mconsole.log('Termo não encontrado: ' + arrayTermo[i]) }
      }
    }
  })
}
