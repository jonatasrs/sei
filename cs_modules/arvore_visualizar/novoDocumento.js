function novoDocumento (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.novoDocumento')

  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        AdicionarBotao()
        observer.disconnect()
      }
    }
  })
  observer.observe(document.querySelector('#divArvoreAcoes'), { childList: true })

  function AdicionarBotao (params) {
    /* Verifica se já tem o botão de novo documento */
    const havenewdoc = $('#divArvoreAcoes a[href*="acao=documento_escolher_tipo"]').length
    const havenewdocp = $('#divArvoreAcoes a[href*="acao=documento_receber"]').length

    /* Se não tiver o botão faz */
    if (!havenewdoc && !havenewdocp) {
      /* Pega o head do html */
      let b = 0
      let botao = ''
      const head = $(parent.document.getElementById('ifrArvore').contentWindow.document.head).html()
      let tipo = 'documento_escolher_tipo'
      let a = head.indexOf('<a href="controlador.php?acao=' + tipo)

      if (a == -1) {
        tipo = 'documento_receber'
        a = head.indexOf('<a href="controlador.php?acao=' + tipo)
        if (a == -1) {
          mconsole.log('Link não encontrado.')
          return
        }
      }
      mconsole.log(tipo)

      /* Adiciona botão novo documento */
      b = head.indexOf('</a>', a) + 4
      botao = head.substring(a, b)
      $('#divArvoreAcoes').prepend($(botao))

      mconsole.log('Link adicionado com sucesso.')
    } else {
      mconsole.log('Já existe o botão.')
    }
  }
}
