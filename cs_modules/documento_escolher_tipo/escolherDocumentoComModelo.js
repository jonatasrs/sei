/* global __mconsole, carregarDadosStorage */
function EscolherDocumentoComModelo (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.EscolherDocumentoComModelo')

  /* busca no storage se teve algum documento modelo selecionado */
  function verificarSeHaModeloSelecionado () {
    carregarDadosStorage({
      'seipp.procedimento_visualizar.DocumentoModelo.documento': null,
      'seipp.procedimento_visualizar.DocumentoModelo.descricao': null
    }, function (dados) {
      if (
        dados['seipp.procedimento_visualizar.DocumentoModelo.documento'] &&
        dados['seipp.procedimento_visualizar.DocumentoModelo.descricao']
      ) {
        const dadosDocSEI = {
          documento: dados['seipp.procedimento_visualizar.DocumentoModelo.documento'],
          descricao: dados['seipp.procedimento_visualizar.DocumentoModelo.descricao']
        }
        mconsole.log(`Modelo Selecionado: ${dadosDocSEI.descricao} ${dadosDocSEI.documento}`)
        carregarModelo(dadosDocSEI)
      }
    })
  }

  function carregarModelo (dadosDocSEI) {
    atualizarTitulo(dadosDocSEI.documento)
    adivinharTipoDocumento(dadosDocSEI.descricao)
  }

  /* a partir da descrição do documento modelo, tenta adivinhar qual é o tipo do novo documento */
  function adivinharTipoDocumento (descricao) {
    let tipo = descricao

    /**
     * 'Minuta de Documento' => 'Documento'
     * 'Minuta Documento' => 'Documento'
     */
    tipo = descricao.replace(/Minuta(:?\sde)?\s*/, '')

    /**
     * 'Documento 123' => 'Documento'
     */
    tipo = tipo.replace(/\s*[0-9]+$/, '')

    tipo = tipo.trim()

    const linksTipos = $('a.ancoraOpcao')
    linksTipos.each(function () {
      const linkTipo = $(this)
      const linkDescr = linkTipo.text().trim()
      if (linkDescr === tipo) {
        $('#txtFiltro').val(tipo).trigger('change')
        setTimeout(function () {
          $('#txtFiltro')[0].dispatchEvent(new KeyboardEvent('keyup'))
        }, 100)
        return false
      }
    })
  }

  /* adiciona o documento SEI modelo ao lado do título "Gerar Documento" */
  function atualizarTitulo (documento) {
    const titulo = $('div.infraBarraLocalizacao')
    const subtitulo = $('<div />', {
      class: 'seipp-documento-modelo',
      text: `Modelo: SEI ${documento}`
    })
    titulo.append(subtitulo)
  }

  verificarSeHaModeloSelecionado()
}
