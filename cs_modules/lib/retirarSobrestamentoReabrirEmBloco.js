function retirarSobrestamentoReabrirEmBloco (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.retirarSobrestamentoReabrirEmBloco')

  const regexHrefPage3 = /Nos[\s]*\[[\s]*0[\s]*\][\s]*=[\s]*new[\s]*infraArvoreNo[\s]*\([\s]*"\w+"[\s]*,[\s]*"\d+"[\s]*,[\s]*null,[\s]*"([^\"]+)"/
  const regexHrefPage4Sobrestado = /(controlador\.php\?acao=procedimento_remover_sobrestamento[^']+)/
  const regexHrefPage4Fechado = /(controlador\.php\?acao=procedimento_reabrir[^']+)/

  const idModalSaida = 'idModalSaida'
  const idTextoSaida = 'idTextoSaida'
  const titleModal = 'Status da operação...'

  let processosStatus
  let processosErro
  let qtdProcessoSucesso

  function newElement (elemento) {
    return $(document.createElement(elemento))
  }

  function imprimirLog (msg) {
    mconsole.log(msg)
    imprimirStatus(msg)
  }

  function imprimirError (msg) {
    console.error(msg)
    imprimirStatus(msg)
  }

  function imprimirStatus (msg) {
    const totalTextoSaida = textoSaida.val()
    textoSaida.val((totalTextoSaida ? totalTextoSaida + '\n' : '') + msg)
    if (textoSaida.length) { textoSaida.scrollTop(textoSaida[0].scrollHeight - textoSaida.height()) }
  }

  function parseCall (parseFunction, callFunction, numeroProcesso, numeroChamada) {
    let resultado
    try {
      resultado = parseFunction()
    } catch (err) { }

    if (resultado && resultado.href) {
      imprimirLog(numeroProcesso + ' (' + numeroChamada + '/4)...')
      $.get(resultado.href, null, callFunction).fail(function () {
        imprimirError(numeroProcesso + ' (Erro na chamada nº ' + numeroChamada + ')!')
        removerFinalizar(numeroProcesso, true)
      })
    } else {
      if (resultado) {
        imprimirError(numeroProcesso + ' (' + resultado.error + ')!')
      } else {
        imprimirError(numeroProcesso + ' (Erro na chamada nº ' + numeroChamada + ')!')
      }
      removerFinalizar(numeroProcesso, true)
    }
  }

  function getLink (linkRelativo) {
    return window.location.origin + '/sei/' + linkRelativo
  }

  function removerFinalizar (numeroProcesso, houveErro) {
    processosStatus.splice(processosStatus.indexOf(numeroProcesso), 1)
    if (houveErro) processosErro.push(numeroProcesso); else qtdProcessoSucesso++
    if (processosStatus.length === 0) {
      const strLog = (processosErro.length > 0 ? '\nHouve erro ao reabrir os seguintes processos:\n' + processosErro.join('\n') + '\n' : '') +
        '\nExecução finalizada com sucesso.' +
        '\nProcessos reabertos: ' + qtdProcessoSucesso +
        '\nProcessos com erro: ' + processosErro.length
      imprimirLog(strLog)
    }
  }

  function removerSobrestamento (element, index, total) {
    const numeroProcesso = element.textContent
    processosStatus.push(numeroProcesso)

    parseCall(function () {
      return { href: element.href }
    }, function (dataPagina2) {
      parseCall(function () {
        return { href: getLink($($.parseHTML(dataPagina2)).find('#ifrArvore').attr('src')) }
      }, function (dataPagina3) {
        let isRemoverSobrestamento = false
        let isReabrir = false

        parseCall(function () {
          const textScript = $($.parseHTML(dataPagina3, null, true)).filter('script').text()
          isRemoverSobrestamento = textScript.indexOf('Remover Sobrestamento do Processo') !== -1
          isReabrir = textScript.indexOf('Reabrir Processo') !== -1
          if (isRemoverSobrestamento || isReabrir) { return { href: getLink(textScript.match(regexHrefPage3)[1]) } }
          return { error: 'Processo não se encontra sobrestado ou fechado' }
        }, function (dataPagina4) {
          parseCall(function () {
            if (isRemoverSobrestamento) { return { href: getLink($($.parseHTML(dataPagina4, null, true)).filter('script').text().match(regexHrefPage4Sobrestado)[1]) } } else if (isReabrir) { return { href: getLink($($.parseHTML(dataPagina4, null, true)).filter('script').text().match(regexHrefPage4Fechado)[1]) } } else { return { error: 'Processo não se encontra sobrestado ou fechado' } }
          }, function () {
            imprimirLog(numeroProcesso + ' (Reaberto com sucesso!)')
            removerFinalizar(numeroProcesso, false)
          }, numeroProcesso, 4)
        }, numeroProcesso, 3)
      }, numeroProcesso, 2)
    }, numeroProcesso, 1)
  }

  function apresentarDialogText (texto) {
    const script = document.createElement('script')
    script.textContent = texto
    document.head.appendChild(script)
    script.remove()
  }

  $('html body').first().append(
    newElement('div').attr({ id: idModalSaida })
      .append(newElement('form').append(
        newElement('textarea').attr({ id: idTextoSaida, rows: '25', cols: '70' }).prop('disabled', true)))
  )

  {
    const script = document.createElement('script')
    script.textContent = "function apresentarDialog(a) { let modalSaida = $('#" + idModalSaida + "'); return modalSaida.dialog.apply(modalSaida, arguments); }"
    document.head.appendChild(script)
  }

  apresentarDialogText("apresentarDialog({autoOpen: false, modal: true, width: 'auto'});")

  const textoSaida = $('#' + idTextoSaida)

  $('#divInfraBarraComandosSuperior').prepend(
    newElement('button').attr({
      id: 'idRetirarSobrestamento',
      value: 'Reabrir',
      type: 'button'
    }).addClass('infraButton')
      .text('Reabrir Processo')
      .click(function () {
        const sei4 = seiVersionCompare('>=', '4')
        const checkBoxs = $('input.infraCheckbox:checked, input.infraCheckboxInput:checked')
        const links = (sei4
          ? checkBoxs.parent().parent().parent()
          : checkBoxs.parent().parent()
        ).find('a[href*="controlador.php?acao=procedimento_trabalhar"]')
        if (links.length === 0) {
          alert('Nenhum processo para reabrir selecionado.')
        } else {
          if (confirm('Confirma a reabertura dos processos selecionados?')) {
            textoSaida.val('')
            processosStatus = []
            processosErro = []
            qtdProcessoSucesso = 0
            apresentarDialogText("apresentarDialog('option', 'title', '" + titleModal + "'); apresentarDialog('open');")
            links.each(function (index, element) { removerSobrestamento(element, index, links.length) })
          }
        }
      }))
}
