/* global __mconsole, salvarDadosStorage, salvarDadosStorage, AnimacaoFade, ExecutarNaArvore */
function documentoModelo (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.documentoModelo')
  const urlNovoDoc = obterURLNovoDoc()
  if (!urlNovoDoc) return

  /* procura a url de incluir um novo documento */
  function obterURLNovoDoc () {
    const ultimaScriptTag = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1]
    const regex = /^Nos\[0\].acoes = '<a href="(controlador\.php\?acao=documento_escolher_tipo&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar.*?)"/m
    const resultado = regex.exec(ultimaScriptTag.innerHTML)
    if (resultado === null) return null
    return resultado[1]
  }

  /* extrai os dados do documento SEI do link fornecido (descrição e documento SEI)  */
  function extrairDadosDocSEI (linkDocumento) {
    const span = linkDocumento.querySelector('span')
    const regex = /^(.+)\s+\(?([0-9]{7,11})\)?$/.exec(span.getAttribute('title'))
    if (!regex) return null
    return {
      documento: regex[2],
      descricao: regex[1]
    }
  }

  /* salva os dados do documento modelo no storage e abre a página de escolher o tipo de documento */
  function abrirUrlNovoDoc (dadosDocSEI) {
    const data = {
      'seipp.procedimento_visualizar.DocumentoModelo.documento': dadosDocSEI.documento,
      'seipp.procedimento_visualizar.DocumentoModelo.descricao': dadosDocSEI.descricao
    }
    salvarDadosStorage(data, function () {
      const targetIframe = $(window.parent.document).find('iframe#ifrVisualizacao')
      targetIframe.attr('src', urlNovoDoc)
    })
  }

  function limparDocumentoModelo () {
    salvarDadosStorage({
      'seipp.procedimento_visualizar.DocumentoModelo.documento': null,
      'seipp.procedimento_visualizar.DocumentoModelo.descricao': null
    })
  }

  /* Adiciona ícone para usar documento como modelo */
  function adicionarIcones () {
    /* procura por todos os links da árvore */
    const documentos = document.querySelectorAll(".infraArvore>a[target='ifrVisualizacao'][href*='id_documento']")

    documentos.forEach((documento) => {
      // const linkDocumento = $(this)

      /** Verifica se é documento interno */
      const isNotDocumentoInterno = !documento.previousElementSibling.querySelector('img[src*="documento_interno"')
      if (isNotDocumentoInterno) return

      /** Pegar dados nome documento e número sei */
      const dadosDocSEI = extrairDadosDocSEI(documento)
      if (!dadosDocSEI) return true

      const docId = documento.getAttribute('id').substr(6)
      const botaoId = `seipp-dup${docId}`

      /* verifica se o botão já existe */
      if ($(`img#${botaoId}`).length > 0) return true

      /* cria o ícone de documento modelo */
      const linkModelo = $('<img>', {
        id: botaoId,
        title: 'Usar documento como modelo',
        src: currentBrowser.runtime.getURL('icons/modelo.png')
      })

      /* adiciona o ícone ao lado do link do documento  */
      documento.after(
        $('<img />', { src: '/infra_css/imagens/espaco.gif' }).get(0),
        linkModelo.get(0)
      )

      /* adiciona o evento */
      linkModelo.on('click', function (e) {
        AnimacaoFade(this)
        abrirUrlNovoDoc(dadosDocSEI)
        e.preventDefault()
      })
    })
  }

  ExecutarNaArvore(mconsole, adicionarIcones)

  /* toda vez que carrega a árvore, zera a referência do documento modelo */
  limparDocumentoModelo()
}
