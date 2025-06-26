function VerificarBlocoAssinatura (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.VerificarBlocoAssinatura')

  const bloco = localizaItemBloco() // obtem o elemento html para o bloco de assinaturas
  if (bloco == undefined) return // FIX BUG: Caso não exista o menu, retorna.
  const link = bloco.find('a').attr('href') // link com hash
  const xmlhttpr = $.get(GetBaseUrl() + link, parseResult)

  /** *Verifica a existência de blocos de assinatura e altera a cor do texto no menu, caso exista */
  function localizaItemBloco () {
    let element
    const menu = (seiVersionCompare('>=', '4.0.0.0')) ? '#infraMenu li' : '#main-menu li'
    $(menu).each(function (index) { if ($(this).text().indexOf('Assinatura') !== -1) element = $(this) })
    return element
  }

  function parseResult (data) {
    const htmldata = $($.parseHTML(data))
    const tabela = $(htmldata).find('#divInfraAreaTabela > table > tbody > tr')

    let numAbertos = 0
    let numDispPelaArea = 0
    let numDispParaArea = 0
    let numRetornado = 0
    let numBlocos = tabela.length // quantidade de linhas da tabela (zero, caso não tenha blocos, numero de blocos + 1 caso tenha)
    if (numBlocos !== 0) { numBlocos-- } // não conta a linha de cabeçalho

    const indexRowEstado = seiVersionCompare('>=', '4.0.0.0') ? 4 : 2
    const indexRowDisponibilizacao = seiVersionCompare('>=', '4.0.0.0') ? 6 : 4

    tabela.each(function (index) {
      if (index > 0) { // desconsidera a linha do cabeçalho (index == 0 )
        const tipo = $(this).children().get(indexRowEstado).innerHTML
        if (tipo === 'Disponibilizado') {
          const areaDisp = $(this).children().get(indexRowDisponibilizacao).innerHTML // se disponibilizado, verifica a Unidade de disponibilização.
          if (areaDisp !== '') { // se não estiver em branco, significa disponibilizado pela minha área
            numDispPelaArea++
          } else { numDispParaArea++ } // disponibilizado para a minha área
        } else if (['Aberto', 'Gerado'].includes(tipo)) {
          numAbertos++
        } else if (tipo === 'Retornado') {
          numRetornado++
        } else if (tipo === 'Recebido') {
          // Situação da versão 4.0.0
          numDispParaArea++
        }
      }
    })

    if (numBlocos > 0) {
      const $container = $('<span/>')
      if (numDispParaArea > 0) {
        $container.append(
          $('<img/>')
            .attr('src', currentBrowser.runtime.getURL('icons/iconRed.png'))
            .attr('title', `Blocos disponibilizados para minha área: ${numDispParaArea}`)
        )
      }
      if (numDispPelaArea > 0) {
        $container.append(
          $('<img/>')
            .attr('src', currentBrowser.runtime.getURL('icons/iconBlue.png'))
            .attr('title', `Blocos disponibilizados pela minha área: ${numDispPelaArea}`)
        )
      }
      if (numRetornado > 0) {
        $container.append(
          $('<img/>')
            .attr('src', currentBrowser.runtime.getURL('icons/iconGreen.png'))
            .attr('title', `Blocos retornados: ${numRetornado}`)
        )
      }
      if (numAbertos > 0) {
        $container.append(
          $('<img/>')
            .attr('src', currentBrowser.runtime.getURL('icons/iconYellow.png'))
            .attr('title', `Blocos abertos: ${numAbertos}`)
        )
      }

      $('#seipp').append(
        $('<a>').attr('href', link).append($container)
      )
    }
  }
}
