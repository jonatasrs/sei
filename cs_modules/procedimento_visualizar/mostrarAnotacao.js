/* global __mconsole, GetBaseUrl */
function MostrarAnotacao (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.MostrarAnotacao')

  let txanotacao = ''
  let prioridade = false
  let hdnIdProtocolo = ''
  let hdnInfraTipoPagina = ''
  let postUrl = ''

  /** Pega a url de alteração do processo ***************************************/
  const head = $('head').html()
  const a = head.indexOf('controlador.php?acao=anotacao_registrar&')
  if (a === -1) return
  const b = head.indexOf('"', a)
  let url = head.substring(a, b)
  url = GetBaseUrl() + url
  mconsole.log(url)

  const $element = $('#container').length > 0 ? $('#container') : $('body')
  $element.append(`
    <div class='seipp-separador'><span>Anotações</span></div>
    <div id='seipp_div_anotacao'></div>
  `)

  function mostrarNota () {
    /* limpa nota atual */
    $('#seipp_div_anotacao').empty()

    /* Pega o html da pagina de alteração do processo */
    mconsole.log('Carregado os dados...')
    const WebHttp = $.ajax({ url })
    WebHttp.done(function (html) {
      txanotacao = $(html).find('#txaDescricao').text()
      prioridade = ($(html).find('#chkSinPrioridade:checked').length > 0)
      hdnIdProtocolo = $(html).find('#hdnIdProtocolo').val()
      hdnInfraTipoPagina = $(html).find('#hdnInfraTipoPagina').val()
      postUrl = $(html).find('#frmAnotacaoCadastro').attr('action')
      mconsole.log('Prioridade: ' + prioridade)
      mconsole.log('Texto: ' + txanotacao)
      mconsole.log('hdnIdProtocolo: ' + hdnIdProtocolo)
      mconsole.log('hdnInfraTipoPagina: ' + hdnInfraTipoPagina)
      mconsole.log('frmAnotacaoCadastro: ' + hdnInfraTipoPagina)
      mconsole.log('postUrl: ' + postUrl)

      $('#seipp_div_anotacao').append(`
        <div class='seipp_sem_anotacao'>
          <img class='seipp_icone_nota' src='${browser.runtime.getURL('icons/note.png')}'/>
          <p>Este processo não possui anotações. <a href='#' class='seipp_anotacao_criar_nota'>Clique aqui</a> para criar uma nota.</p>
        </div>
        <div class='seipp_anotacao'>
          <div class='seipp_anotacao_botoes'>
            <a href='#' class='seipp_anotacao_botao seipp_anotacao_btn_remover'><img class='seipp_anotacao_icone' src='${browser.runtime.getURL('icons/removeNote.png')}'/></a>
            <a href='#' class='seipp_anotacao_botao seipp_anotacao_btn_editar'><img class='seipp_anotacao_icone' src='${browser.runtime.getURL('icons/editNote.png')}'/></a>
          </div>
          <p class='seipp_anotacao_texto'>${txanotacao}</p>
          <div class='seipp_anotacao_editar'>
            <textarea class='seipp_anotacao_txt_editar' maxlength='500'></textarea>
            <div class='seipp_anotacao_prioridade'>
              <input type="checkbox" id="chkSinPrioridade" name="chkSinPrioridade" class="infraCheckbox" ${prioridade ? 'checked' : null}>
              <label id="lblSinPrioridade" for="chkSinPrioridade" accesskey="" class="infraLabelCheckbox">Prioridade</label>
            </div>
            <div class='seipp_anotacao_editar_botoes'>
              <button value="Cancelar" class="infraButton seipp_anotacao_btn_cancelar_editar">Cancelar</button>
              <button value="Salvar" class="infraButton seipp_anotacao_btn_salvar_edicao">Salvar</button>
            </div>
          </div>
        </div>
      `)

      esconderSeNaoHaNota()

      if (prioridade) {
        $('div.seipp_anotacao').addClass('seipp-anotacao-red')
      }
      $('a.seipp_anotacao_btn_editar, a.seipp_anotacao_criar_nota').on('click', function (e) {
        editarNota()
        e.preventDefault()
      })

      $('button.seipp_anotacao_btn_cancelar_editar').on('click', function (e) {
        cancelarEditarNota()
        e.preventDefault()
      })

      $('button.seipp_anotacao_btn_salvar_edicao').on('click', function (e) {
        salvarNota()
        e.preventDefault()
      })

      $('a.seipp_anotacao_btn_remover').on('click', function (e) {
        removerNota()
        e.preventDefault()
      })
    })
  }

  function esconderSeNaoHaNota () {
    if (txanotacao === '') {
      $('div.seipp_anotacao').hide()
      $('div.seipp_sem_anotacao').show()
    } else {
      $('div.seipp_sem_anotacao').hide()
      $('div.seipp_anotacao').show()
    }
  }

  function editarNota () {
    $('div.seipp_sem_anotacao').hide()
    $('div.seipp_anotacao').show()
    $('div.seipp_anotacao_botoes').hide()
    $('textarea.seipp_anotacao_txt_editar').width($('p.seipp_anotacao_texto').width())
    $('p.seipp_anotacao_texto').hide()
    $('textarea.seipp_anotacao_txt_editar').val($('p.seipp_anotacao_texto').text())
    $('div.seipp_anotacao_editar').show()
    $('textarea.seipp_anotacao_txt_editar').focus()
  }

  function cancelarEditarNota () {
    esconderSeNaoHaNota()
    $('div.seipp_anotacao_botoes').show()
    $('p.seipp_anotacao_texto').show()
    $('div.seipp_anotacao_editar').hide()
  }

  function removerNota () {
    const confirmOk = confirm('Deseja remover a anotação deste processo?')
    if (!confirmOk) return
    $('textarea.seipp_anotacao_txt_editar').val('')
    salvarNota()
  }

  // Kind of encodeURIComponent for ISO-8859-1
  function escapeComponent (str) {
    return escape(str).replace(/\+/g, '%2B')
  }

  function salvarNota () {
    let txaDescricao = $('textarea.seipp_anotacao_txt_editar').val()
    txaDescricao = escapeComponent(txaDescricao.trim())
    let chkSinPrioridade = $('#chkSinPrioridade').is(':checked') ? 'on' : 'off'
    if (txaDescricao === '') chkSinPrioridade = 'off'

    $.post({
      url: `${GetBaseUrl()}${postUrl}`,
      data: `hdnInfraTipoPagina=${hdnInfraTipoPagina}&sbmRegistrarAnotacao=Salvar&txaDescricao=${txaDescricao}&hdnIdProtocolo=${hdnIdProtocolo}&chkSinPrioridade=${chkSinPrioridade}`,
      complete: function (jqXHR, textStatus) {
        mostrarNota()
      }
    })
  }

  /* mostra a nota assim que a página carregar */
  mostrarNota()
}
