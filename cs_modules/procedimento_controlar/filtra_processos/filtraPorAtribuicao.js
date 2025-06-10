/* global __mconsole, filtrarTabela, removerFiltroTabela, SavedOptions */
function FiltraPorAtribuicao(BaseName) { // eslint-disable-line no-unused-vars
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.FiltraPorAtribuicao')

  async function inicio() {
    const idTabelaProcessosRecebidos = 'tblProcessosRecebidos'
    const idTabelaProcessosGerados = 'tblProcessosGerados'
    const idTabelaProcessosDetalhado = 'tblProcessosDetalhado'

    const tabelaRecebidos = getTabela(idTabelaProcessosRecebidos)
    const tabelaGerados = getTabela(idTabelaProcessosGerados)
    const tabelaDetalhado = getTabela(idTabelaProcessosDetalhado)

    if ($('#divInfraBarraLocalizacao').text() === 'Controle de Processos' && (tabelaRecebidos.length > 0 || tabelaGerados.length > 0 || tabelaDetalhado.length > 0)) {
      const keyAtribuido = 'atribuido'
      const valueAtribuido = { value: '*' }

      const trsRecebidos = getProcessos(tabelaRecebidos)
      const trsGerados = getProcessos(tabelaGerados)
      const trsDetalhado = getProcessos(tabelaDetalhado)

      // const captionRecebidos = getTabelaCaption(tabelaRecebidos)
      // const captionGerados = getTabelaCaption(tabelaGerados)
      // const captionDetalhado = getTabelaCaption(trsDetalhado)

      const trs = trsRecebidos.add(trsGerados).add(trsDetalhado)

      const idVerSomenteMeusProcessos = 'divFiltro'

      const selectVerProcessosDe = newElement('select')
        .change(function () {
          changeSelectVerProcess(this.value, tabelaRecebidos, trsRecebidos, keyAtribuido)
          changeSelectVerProcess(this.value, tabelaGerados, trsGerados, keyAtribuido)
          changeSelectVerProcess(this.value, tabelaDetalhado, trsDetalhado, keyAtribuido)
          if (valueAtribuido.value !== this.value) {
            valueAtribuido.value = this.value
            valorSalvoSet(this.value)
          }
        }).append([
          newElement('option')
            .attr('value', '*')
            .text('Ver todos os processos'),
          newElement('option')
            .attr('value', '')
            .text('Ver processos não atribuídos')
        ])

      adicionarOptionAtribuido(selectVerProcessosDe, trs)

      const value = await valorSalvoGet()
      valueAtribuido.value = value
      atualizaSelect(selectVerProcessosDe, value, keyAtribuido)

      $('#' + idVerSomenteMeusProcessos).css('height', 'auto').css('font-size', 'smaller').prepend(criarTabelaNova(selectVerProcessosDe))
    }
  }

  function newElement(elemento) {
    return $(document.createElement(elemento))
  }

  function criarTabelaNova(selectNovo) {
    const novaTabela = newElement('table').css('width', '100%')
    const novoTr = newElement('tr').appendTo(newElement('tbody')).appendTo(novaTabela)
    mconsole.log(novoTr)
    novoTr.append(newElement('td').append(selectNovo))
    novoTr.append(newElement('td').append($('#divMeusProcessos').css('position', 'initial')))
    novoTr.append(newElement('td').append($('#divVerPorMarcadores').css('position', 'initial').css('text-align', 'center')))
    novoTr.append(newElement('td').append($('#divTipoVisualizacao').css('position', 'initial').css('text-align', 'right')))
    return novaTabela
  }

  async function atualizaSelect(select, value, keyAtribuido) {
    if (select.children("option[value='" + value + "']").length > 0) {
      select.val(value).change()
    } else {
      valorSalvoDelete()
    }
  }

  function adicionarOptionAtribuido(select, trs) {
    const nomes = {}
    getLinkAtribuido(trs).each(function (index, alink) {
      nomes[alink.innerHTML] = getAtribuido(alink)
    })
    Object.keys(nomes).sort().forEach(function (id) {
      select.append(
        newElement('option')
          .attr('value', id)
          .text('Ver processos atribuídos à ' + nomes[id])
      )
    })
  }

  const classeFiltro = 'PorAtribuicao'

  function changeSelectVerProcess(value, tabela, trs, keyAtribuido) {
    if (value !== '*') {
      filtrarTabela(tabela, trs, classeFiltro, function (indexTr, tr) {
        const alink = getLinkAtribuido($(tr))
        return (value === '' && alink.length === 0) || alink.text() === value
      })
    } else {
      removerFiltroTabela(tabela, trs, classeFiltro)
    }
  }

  function getLinkAtribuido(trs) {
    return trs.find('td:nth-child(4) a')
  }

  function getAtribuido(alink) {
    if (SavedOptions.filtraporatribuicao === 'nome') { return alink.title.substr(15) }
    return alink.innerHTML
  }

  function getTabela(idTabelaProcessos) {
    return $('#' + idTabelaProcessos).first()
  }

  function getProcessos(tabela) {
    return tabela.children('tbody').first().children('tr[class^="infraTr"]')
  }

  // function getTabelaCaption (tabela) {
  //   return tabela.children('caption.infraCaption')
  // }

  async function valorSalvoGet() {
    const { moduloFiltraPorAtribuicao: valor } = await currentBrowser.storage.local.get('moduloFiltraPorAtribuicao')
    return [null, undefined].includes(valor) ? '*' : valor
  }

  function valorSalvoSet(valor) {
    currentBrowser.storage.local.set({ moduloFiltraPorAtribuicao: valor })
  }

  function valorSalvoDelete() {
    currentBrowser.storage.local.remove('moduloFiltraPorAtribuicao')
  }

  inicio()
}
