/* global __mconsole, AnimacaoFade, ExecutarNaArvore */
function copiarNumeroProcessoDocumento (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.copiarNumeroProcessoDocumento')

  const srcImgCopiar = 'data:image/gif;base64,R0lGODdhEAAQAMZNAAQCBISCdERCPMzCpGxmVOzixHRyXCQiHKyijNzStGxqXPTu3FxaTMS6nBQWFHx2bPz23ExORNTKrGRmZDQyLOTavGxqZERCRPTq1HRyZMS6pAwKDKSejMzGrGRiXCwqJPz27HR2ZOzizLSqlNzWvGxuXPzy5FxeXCQeHOTaxGxuZERGRMS+pGRmXAQGBJSKdExGPNTGpCwmJPzy3GReVMy6nBwWFHx6bPz25NzOtGxmZDw6NPTu1HxyZAwODKSelNTGrCwuJPz67Hx2ZPTmzLSulOTWvHRuXOTexHRuZExGRMy+pGxmXP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ywAAAAAEAAQAAAHqoAnNEOEhYaEDDsMOCAgOIyOjZAQDAaMODOXlzNCjiFHJjOioQClAJmPISUYrKylrQA8oRklRLZEpbe3GAsZCgXABaXBwCIiGL4VSMulSMrLyyJJCkbVRqXW2SkqTAneCaXf4iQWLRLn56XoAOc55UDw8aYAQDExQBYeAwNL+/z7/Zb00+FhCYsaGhDWMIhQg4YlEwQAaUCx4sSKDYCscHHBg8ePID1e2BAIADs='
  const srcImgEspaco = '/infra_css/imagens/espaco.gif'
  const idmod = 'seipp-cnpd'

  function gerarInserirLink (element, numeroDocumento, numeroSei, nomeDocumento) {
    const linkSei = document.createElement('a')
    linkSei.id = 'lnkSei' + numeroDocumento
    linkSei.className = 'ancoraSei'
    $(linkSei).append(numeroSei)

    const spanNotEditable = document.createElement('span')
    spanNotEditable.setAttribute('contenteditable', 'false')
    spanNotEditable.appendChild(linkSei)

    const spanGeral = document.createElement('span')
    if (nomeDocumento) $(spanGeral).append(nomeDocumento + ' (')
    spanGeral.appendChild(spanNotEditable)
    if (nomeDocumento) $(spanGeral).append(')')
    spanGeral.style.display = 'none'

    const spanParent = element.parentNode
    spanParent.parentNode.insertBefore(spanGeral, spanParent.nextSibling)

    return spanGeral
  }

  function gerarInserirCopy (span, title) {
    const imgCopiar = document.createElement('img')
    imgCopiar.src = srcImgCopiar
    imgCopiar.title = title
    imgCopiar.id = idmod + span.id.substr(4)

    const imgEspaco = document.createElement('img')
    imgEspaco.src = srcImgEspaco

    const spanParent = span.parentNode
    spanParent.parentNode.insertBefore(imgCopiar, spanParent.nextSibling)
    spanParent.parentNode.insertBefore(imgEspaco, spanParent.nextSibling)
    mconsole.log('Link copiar adicionado: ' + $(span).text())
    return imgCopiar
  }

  function getNumeroDocumento (text) {
    const resultIdRegex = /^span([0-9]{1,11})$/g.exec(text)
    if (resultIdRegex) return resultIdRegex[1]
  }

  function copiarNumero (spanGeral) {
    spanGeral.style.display = 'block'
    const range = document.createRange()
    range.selectNodeContents(spanGeral)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    try {
      document.execCommand('copy')
      sel.removeAllRanges()
    } catch (err) {
      alert('Infelizmente, seu sistema não permite copiar automaticamente. Pressione Ctrl + C para copiar.')
    }
    spanGeral.style.display = 'none'
  }

  function iniciar () {
    let span = document.querySelector('#divArvore>a>span')
    if (!span) {
      span = document.querySelector(".infraArvore > a[target='ifrVisualizacao'] > span")
    }
    if (span && $('#' + idmod + span.id.substr(4)).length === 0) {
      const numeroDocumento = getNumeroDocumento(span.id)
      if (numeroDocumento) {
        const spanGeral = gerarInserirLink(span, numeroDocumento, span.innerHTML.trim())
        gerarInserirCopy(span, 'Copiar Número do Processo').addEventListener('click', function () {
          AnimacaoFade(this)
          copiarNumero(spanGeral)
        })
      }
    }

    $("#divArvore > div a[target='ifrVisualizacao'] > span").each(function (index, element) {
      let numeroSei
      let nomeDocumento
      const numeroDocumento = getNumeroDocumento(element.id)

      if ($('#' + idmod + element.id.substr(4)).length !== 0) return
      const resultNomeRegex = /^(.+)\s+\(?([0-9]{7,11})\)?$/.exec(element.title)
      if (resultNomeRegex) {
        nomeDocumento = resultNomeRegex[1]
        numeroSei = resultNomeRegex[2]
      }

      if (numeroSei && numeroDocumento && nomeDocumento) {
        const spanGeral = gerarInserirLink(element, numeroDocumento, numeroSei, nomeDocumento)
        gerarInserirCopy(element, 'Copiar Documento').addEventListener('click', function () {
          AnimacaoFade(this)
          copiarNumero(spanGeral)
        })
      }
    })
  }

  ExecutarNaArvore(mconsole, iniciar)
}
