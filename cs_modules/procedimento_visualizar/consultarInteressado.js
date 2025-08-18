/* global __mconsole, GetBaseUrl, SavedOptions, isBackgroundColorDark */
// eslint-disable-next-line no-unused-vars
function ConsultarInteressado (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.ConsultarInteressado')

  /** Variaveis *****************************************************************/
  const processo = { numero: '', interessados: [], tipo: '' }

  /** Pega a url de alteração do processo ***************************************/
  const head = $('head').html()
  let a = head.indexOf('controlador.php?acao=procedimento_alterar&')
  if (a === -1) { a = head.indexOf('controlador.php?acao=procedimento_consultar&') }
  if (a === -1) {
    mconsole.log('Consulta não disponível para este processo!!!')
    return
  }
  const b = head.indexOf('"', a)
  let url = head.substring(a, b)
  url = GetBaseUrl() + url
  mconsole.log(url)

  DetalheProcessoCriar()

  /* Pega o html da pagina de alteração do processo */
  const WebHttp = $.ajax({ url })
  WebHttp.done(function (html) {
    const $html = $(html)
    processo.numero = $('.infraArvoreNoSelecionado').text()
    mconsole.log('Lendo dados do processo: ' + processo.numero)
    processo.tipo = $html.find("#selTipoProcedimento option[selected='selected']").text()
    processo.interessados = $html.find('#selInteressadosProcedimento option').map(function () {
      // Retorna o id, nome e sigla do interessado
      const regex = /^(.*) \((.*)\)$/
      const match = regex.exec($(this).text()) || ['', $(this).text(), '']
      return { id: $(this).val(), nome: match[1].trim(), sigla: match[2].trim() }
    }).get()

    DetalheProcessoPreencher()
    ExibirDadosProcesso($html)

    /* adiciona as informações sobre o interessado */
    if (SavedOptions.CheckTypes.includes('mostrardetalhesinteressados')) {
      const urlEditarInteressado = obterUrlEditarInteressado(html)
      if (urlEditarInteressado) {
        mconsole.log('Abrindo detalhes do interessado: ' + urlEditarInteressado)
        abrirEditarInteressado(urlEditarInteressado)
      } else {
        mconsole.log('Não foi possível obter a URL do interessado.')
        alert(html)
      }
    }
  })

  /** Funções *******************************************************************/

  function obterUrlEditarInteressado (html) {
    const regex = /^\s*seiCadastroContato\(valor, 'selInteressadosProcedimento', 'frmProcedimentoCadastro','(.*)'\);/m
    const resultado = regex.exec(html)
    return resultado !== null ? resultado[1] : null
  }

  function obterUrlDadosInteressado (html) {
    const regex = /^\s*objAjaxDadosContatoAssociado = new infraAjaxComplementar\(null,'(.*)'\);/m
    const resultado = regex.exec(html)
    return resultado !== null ? resultado[1] : null
  }

  function abrirEditarInteressado (urlEditarInteressado) {
    $.ajax({
      url: GetBaseUrl() + urlEditarInteressado,
      success: function (resposta) {
        const urlCarregarDados = obterUrlDadosInteressado(resposta)
        if (urlCarregarDados) abrirDetalhesInteressados(urlCarregarDados)
      }
    })
  }

  function abrirDetalhesInteressados (urlCarregarDados) {
    $('#seipp_interessados > div').each(function () {
      const elInteressado = $(this)
      const idContato = elInteressado.data('id')
      if (!idContato) return
      abrirDetalhesInteressado(urlCarregarDados, idContato, elInteressado)
    })
  }

  function lerCampoInteressado (resposta, nomeCampo, prefixo) {
    const campo = resposta.querySelector(`complemento[nome='${nomeCampo}']`)
    return campo && campo.textContent.length > 0
      ? `${prefixo || ''}${campo.textContent}`
      : null
  }

  function abrirDetalhesInteressado (urlCarregarDados, idContato, elInteressado) {
    $.ajax({
      url: GetBaseUrl() + urlCarregarDados,
      method: 'POST',
      data: `id_contato_associado=${idContato}`,
      success: function (resposta) {
        const dados = [
          lerCampoInteressado(resposta, 'Endereco'),
          lerCampoInteressado(resposta, 'Complemento'),
          lerCampoInteressado(resposta, 'Bairro'),
          lerCampoInteressado(resposta, 'NomeCidade'),
          lerCampoInteressado(resposta, 'SiglaUf'),
          lerCampoInteressado(resposta, 'NomePais'),
          lerCampoInteressado(resposta, 'Cep', 'CEP ')
        ]
        preencherDetalhesInteressado(elInteressado, dados)
      }
    })
  }

  function preencherDetalhesInteressado (elInteressado, dados) {
    const detalheInteressado = $('<p />', {
      class: 'seipp-detalhe-interessado',
      text: dados.filter(Boolean).join(', ')
    })
    elInteressado.append(detalheInteressado)
  }

  function DetalheProcessoCriar () {
    const container = $('#container').length > 0 ? $('#container') : $('body')

    // Criação segura dos elementos
    container.append(
      $('<div/>').addClass('seipp-separador').append($('<span/>').text('Tipo do processo')),
      $('<div/>').attr('id', 'seipp_tipo').append($('<p/>').addClass('seipp-tipo-processo')),
      $('<div/>').addClass('seipp-separador').append($('<span/>').text('Interessado(s)')),
      $('<div/>').attr('id', 'seipp_interessados')
    )
  }

  function DetalheProcessoPreencher () {
    /* tipo do processo */
    $('#seipp_tipo').attr('title', 'Tipo de processo')
    $('#seipp_tipo p.seipp-tipo-processo').text(processo.tipo)

    /* dados dos interessados */
    $('#seipp_interessados').attr('title', 'Interessado(s)')
    $('#seipp_interessados').empty()
    if (processo.interessados.length > 0) {
      processo.interessados.forEach(function (interessado) {
        // Criação segura dos elementos
        const $div = $('<div/>').attr('data-id', interessado.id)
        const $p = $('<p/>').addClass('seipp-interessado')
        const $img = $('<img/>')
          .attr('height', 10)
          .attr('width', 12)
          .attr('src', currentBrowser.runtime.getURL('icons/interessado.png'))
        const $spanNome = $('<span/>').text(interessado.nome)
        $p.append($img, $spanNome)
        if (interessado.sigla) {
          // Colocar a sigla entre parenteses e incluir um ícone para copiar, exibir um feedback visual de que a sigla foi copiada
          const $spanSigla = $('<span/>').text(' (' + interessado.sigla + ')')
          const $copyIcon = criarCopyIcon($p, interessado.sigla)
          $p.append($spanSigla, $copyIcon)
        }
        $div.append($p)
        $('#seipp_interessados').append($div)
      })
    } else {
      $('#seipp_interessados').append(
        $('<p/>').addClass('seipp-interessado').text('Nenhum interessado especificado.')
      )
    }
  }

  function criarCopyIcon ($p, sigla) {
    const $copyIcon = $('<img/>')
      .attr('src', currentBrowser.runtime.getURL('icons/copy.svg'))
      .css({ filter: isBackgroundColorDark() ? 'invert(1)' : 'none' })
      .attr('alt', 'Copiar sigla')
      .css({ cursor: 'pointer', marginLeft: '4px', width: '12px', height: '12px' })
      .attr('title', 'Copiar sigla do interessado')
      .on('click', function (e) {
        e.stopPropagation()
        navigator.clipboard.writeText(sigla).then(() => {
          // Cria o tooltip de feedback da cópia
          const $tooltip = $('<div/>')
            .addClass('seipp-tooltip')
            .text('Copiado!')
            .css({
              left: $p.offset().left + 6,
              top: $copyIcon.offset().top - 2
            })
          $p.append($tooltip)
          setTimeout(() => {
            $tooltip.remove()
          }, 1000)
        })
      })

    return $copyIcon
  }

  function ExibirDadosProcesso ($html) {
    mconsole.log('ExibirDadosProcesso')
    const iframe = window.parent.document.getElementById('ifrVisualizacao')
    const $iframe = $(iframe)

    $iframe.on('load', function () {
      if ($iframe.contents().find('#divArvoreHtml iframe').length !== 0) { $(this).off('load'); return } else if ($iframe.contents().find('#divInformacao').length === 0) { $(this).off('load'); return }

      const maskProcesso = $('.infraArvoreNoSelecionado').text()
      const interessados = $html.find('#selInteressadosProcedimento option').map(function () { return $(this).text() }).get()
      const descricao = $html.find('#txtDescricao').val()
      const data = $html.find('#txtDtaGeracaoExibir').val()
      mconsole.log(maskProcesso)
      mconsole.log(interessados)
      mconsole.log(descricao)
      mconsole.log(data)

      $iframe.contents().find('#divInformacao').css('width', '300px')
      mconsole.log($iframe.prop('id'))

      // Criação segura dos elementos
      const $detalhes = $('<div/>', { id: 'detalhes', style: 'margin-left: 300px; border: 1px solid; padding: 2px;' })
      $detalhes.append(
        $('<div/>', {
          id: 'divInfraBarraLocalizacao',
          class: 'infraBarraLocalizacao',
          style: 'display:block;'
        }).text('Dados do Processo'),
        $('<div/>', {
          id: 'divProtocoloExibir',
          class: 'infraAreaDados',
          style: 'height:4.5em; clear: both;'
        }).append(
          $('<label/>', {
            id: 'lblProtocoloExibir',
            for: 'txtProtocoloExibir',
            accesskey: '',
            class: 'infraLabelObrigatorio'
          }).text('Protocolo:'),
          $('<input/>', {
            id: 'txtProtocoloExibir',
            name: 'txtProtocoloExibir',
            class: 'infraText infraReadOnly',
            readonly: 'readonly',
            type: 'text',
            style: 'width:150px;',
            value: maskProcesso
          }),
          $('<label/>', {
            id: 'lblDtaGeracaoExibir',
            for: 'txtDtaGeracaoExibir',
            accesskey: '',
            class: 'infraLabelObrigatorio',
            style: 'margin-left: 20px;'
          }).text('Data de Autuação:'),
          $('<input/>', {
            type: 'text',
            id: 'txtDtaGeracaoExibir',
            name: 'txtDtaGeracaoExibir',
            class: 'infraText infraReadOnly',
            readonly: 'readonly',
            style: 'width:150px;'
          })
        ),
        $('<div/>', {
          id: 'divTipoProcedimento',
          class: 'infraAreaDados',
          style: 'height:4.5em; clear: none;'
        }).append(
          $('<label/>', {
            id: 'lblTipoProcedimento',
            for: 'selTipoProcedimento',
            accesskey: '',
            class: 'infraLabelObrigatorio'
          }).text('Tipo do Processo:'),
          $('<input/>', {
            id: 'selTipoProcedimento',
            name: 'selTipoProcedimento',
            class: 'infraText infraReadOnly',
            readonly: 'readonly',
            style: 'width: 95%;',
            value: processo.tipo
          })
        ),
        $('<div/>', {
          id: 'divDescricao',
          class: 'infraAreaDados',
          style: 'height:4.7em; clear: none;'
        }).append(
          $('<label/>', {
            id: 'lblDescricao',
            for: 'txtDescricao',
            accesskey: '',
            class: 'infraLabelOpcional'
          }).text('Especificação:'),
          $('<input/>', {
            id: 'txtDescricao',
            name: 'txtDescricao',
            class: 'infraText infraReadOnly',
            readonly: 'readonly',
            type: 'text',
            style: 'width: 95%;'
          })
        ),
        $('<div/>', {
          id: 'divInteressados',
          class: 'infraAreaDados',
          style: 'height:11em; clear: none;'
        }).append(
          $('<label/>', {
            id: 'lblInteressadosProcedimento',
            for: 'txtInteressadoProcedimento',
            accesskey: 'I',
            class: 'infraLabelOpcional'
          }).append(
            $('<span/>', { class: 'infraTeclaAtalho' }).text('I'),
            document.createTextNode('nteressados:')
          ),
          $('<br/>'),
          $('<textarea/>', {
            id: 'txtInteressadosProcedimento',
            name: 'txtInteressadosProcedimento',
            class: 'infraText infraReadOnly',
            readonly: 'readonly',
            style: 'width: 95%;'
          }).val(interessados.join('\n'))
        )
      )

      $detalhes.insertAfter($iframe.contents().find('#divInformacao'))

      const newiframe = window.parent.document.getElementById('ifrVisualizacao')
      const $newiframe = $(newiframe)

      $newiframe.contents().find('#txtDescricao').attr('value', descricao)
      $newiframe.contents().find('#txtDtaGeracaoExibir').attr('value', data)
      $newiframe.contents().find('#txtInteressadosProcedimento').css('height', '50px')

      mconsole.log('Fechou')
      $(this).off('load')
    })
  }
}
