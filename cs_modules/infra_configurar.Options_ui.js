function Options_ui (BaseName) {
  const mconsole = new __mconsole(BaseName + '.Options_ui')

  $('#divInfraAreaTelaD').append("<div id='seipp-div-options-ui'/>")
  $('#seipp-div-options-ui').load(
    browser.extension.getURL('cs_modules/options_ui/options_ui.html'), function () {
      $('#divInfraBarraComandosSuperior input').hide()
      $('.seipp-options-title').append(' - Versão: ' + browser.runtime.getManifest().version)

      if (!isChrome) {
        browser.storage.local.get('version').then(function (params) {
          const version = parseInt(params.version)
          mconsole.log(version)
          if (version < 68) {
            $('.seipp-options-title').append("<div id='seipp-div-options-ui-alert' />")
            $('#seipp-div-options-ui-alert').append('Firefox ' + version + ' - Você está utilizando uma versão antiga do Firefox, alguns recursos do SEI++ podem não ser compativeis. Atualize o navegador.')
              .css({ 'font-weight': 'bold', color: 'red', filter: 'none', 'background-color': 'black' })
          }
        }, null)
      }

      $('#divInfraBarraLocalizacao').css({
        'padding-left': '10px',
        'margin-top': '10px'
      })
      $('#frmInfraConfigurar, #seipp-div-options-ui').css({
        border: '2px solid',
        padding: '10px',
        marginTop: '10px'
      })

      OptionsLoad()
    }
  )

  /******************************************************************************
   * Atualiza o formulário com as configurações salvas.                         *
   ******************************************************************************/
  function OptionsLoad () {
    /* Tema */
    $('#theme').val(SavedOptions.theme)

    /* Checkbox's */
    $("input[type='checkbox']").each(function () {
      if (SavedOptions.CheckTypes.indexOf($(this).attr('data-type')) != -1) {
        $(this).attr('checked', true)
        mconsole.log('checked')
      } else {
        $(this).attr('checked', false)
        mconsole.log('unchecked')
      }
    })

    /* Marcar cor processo */
    if (SavedOptions.ConfiguracoesCores === undefined) { /* Se não existir esta configuração */
      SavedOptions.ConfiguracoesCores = DefaultOptions.ConfiguracoesCores
    }
    $("#divConfigMarcarCorProcesso input[type='text']").each(function (index) {
      const itemCor = $(this)
      if (itemCor['0'].id.indexOf('cor_') !== -1) {
        itemCor['0'].value = SavedOptions.ConfiguracoesCores[index].valor
      }
    })
    $('#marcarcorprocesso').prev().on('click', function () {
      $('#divConfigMarcarCorProcesso').toggle('fast')
    })

    /* Click Menos */
    $('#cliquemenos').prev().on('click', function () {
      $('#divFormato').toggle('fast')
    })

    /* dropzone */
    $('#incluirdocaoarrastar').prev().on('click', function () {
      $('#divConfigIncluirDocAoArrastar').toggle('fast')
    })

    $("input[name='formato'][value=" + SavedOptions.formato + ']').attr('checked', true)
    $("input[name='formato']").on('change', MostraTipoConferencia)
    $('#divtipoconferencia').hide()
    MostraTipoConferencia()
    $('#tipoconferencia').val(SavedOptions.tipoConferencia)

    mconsole.log('RESTRITO: ' + SavedOptions.nivelAcesso)
    $("input[name='nivelAcesso']").on('change', MostraRestrito)
    $("input[name='nivelAcesso'][value=" + SavedOptions.nivelAcesso + ']').attr('checked', true)
    MostraRestrito()

    $('#hipoteseLegal').val(SavedOptions.hipoteseLegal)

    $('#incluirDocAoArrastar_TipoDocPadrao').val(SavedOptions.incluirDocAoArrastar_TipoDocPadrao || DefaultOptions.incluirDocAoArrastar_TipoDocPadrao)

    /* Filtrar por atribuição */
    $('#nomeUsuarioSistema').text(getNomeUsuarioSistema())
    $('#loginUsuarioSistema').text(getLoginUsuarioSistema())
    $("input[name='filtraporatribuicaoRadio']").val([(SavedOptions.filtraporatribuicao || 'login')])
    $('#filtraporatribuicao').prev().on('click', function () {
      $('#filtraporatribuicaoOptions').toggle('fast')
    })

    /* prazo */
    $('#prazoalerta').val(SavedOptions.ConfPrazo.Alerta)
    $('#prazocritico').val(SavedOptions.ConfPrazo.Critico)
    $("input[data-type='prazo']").prev().on('click', function () {
      $('#prazoOptions').toggle('fast')
    })

    /* dias */
    $('#qtddiasalerta').val(SavedOptions.ConfDias.Alerta)
    $('#qtddiascritico').val(SavedOptions.ConfDias.Critico)
    $("input[data-type='qtddias']").prev().on('click', function () {
      $('#qtddiasOptions').toggle('fast')
    })

    $("input[name='usardocumentocomomodelo']").prop('checked', !!SavedOptions.usardocumentocomomodelo)
    $("input[name='exibeinfoatribuicao']").prop('checked', !!SavedOptions.exibeinfoatribuicao)

    /* Menu suspenso */
    if (seiVersion >= [4, 0, 0]) {
      $("input[data-type='menususp']").prop('checked', false)
      $("input[data-type='menususp']").click((e) => {
        e.stopPropagation()
        $('#dialog-alert').dialog('open')
        e.currentTarget.checked = false
      })
    }

    /* Salvar */
    $('#save-button').on('click', OptionsSave)

    /* Dialogo de Alerta */
    $('#dialog-alert').dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Ok: function () {
          $(this).dialog('close')
        }
      },
      classes: {
        'ui-dialog-titlebar': 'seipp-dialog-alert'
      }
    })

    if (SavedOptions.InstallOrUpdate) {
      SavedOptions.InstallOrUpdate = false
      browser.storage.local.set(SavedOptions)
      $('#lnkConfiguracaoSistema img').css({ animation: 'none' })
    }
  }

  function getUsuarioSistema () {
    return document.getElementById('lnkUsuarioSistema').title
  }

  function getNomeUsuarioSistema () {
    const usuarioSistema = getUsuarioSistema()
    return usuarioSistema.substring(0, usuarioSistema.indexOf(' - '))
  }

  function getLoginUsuarioSistema () {
    const usuarioSistema = getUsuarioSistema()
    return usuarioSistema.substring(usuarioSistema.indexOf(' - ') + 3, usuarioSistema.indexOf('/'))
  }

  function MostraTipoConferencia () {
    toggle($('#divtipoconferencia'), $("input[name='formato']:checked").val() == 'D')
  }

  function MostraRestrito () {
    toggle($('#divhipoteseLegal'), $('#rdRestrito:checked').val() == 'R')
  }

  function toggle (elemento, valor) {
    const anim = 'fast'
    if (valor) { elemento.show(anim) } else { elemento.hide(anim) }
  }

  function OptionsSave () {
    const CheckTypes = []
    $("input[type='checkbox']:checked").each(function () {
      CheckTypes.push($(this).attr('data-type'))
    })
    console.log(CheckTypes)

    const ConfiguracoesCores = []
    $("input[type='text']").each(function () {
      const itemCor = $(this)
      if (itemCor['0'].id.indexOf('cor_') !== -1) {
        const configuracaoCor = { cor: itemCor['0'].id.replace('cor_', '#'), valor: itemCor['0'].value }
        ConfiguracoesCores.push(configuracaoCor)
      }
    })

    const theme = $('#theme').val()
    const formato = $("input[name='formato']:checked").val()
    const tipoConferencia = $('#tipoconferencia').val()
    const nivelAcesso = $("input[name='nivelAcesso']:checked").val()
    const hipoteseLegal = $('#hipoteseLegal').val()
    const filtraporatribuicao = $("input[name='filtraporatribuicaoRadio']:checked").val()
    mconsole.log(nivelAcesso)

    /* Prazo / Dias */
    const ConfPrazo = { Critico: 0, Alerta: 0 }
    const ConfDias = { Critico: 0, Alerta: 0 }
    ConfPrazo.Alerta = parseInt($('#prazoalerta').val())
    ConfPrazo.Critico = parseInt($('#prazocritico').val())
    ConfDias.Alerta = parseInt($('#qtddiasalerta').val())
    ConfDias.Critico = parseInt($('#qtddiascritico').val())
    mconsole.log('CONFDIAS> alerta: ' + ConfDias.Alerta + ' critico:' + ConfDias.Critico)

    const incluirDocAoArrastar_TipoDocPadrao = $('#incluirDocAoArrastar_TipoDocPadrao').val()

    const usardocumentocomomodelo = $("input[name='usardocumentocomomodelo']").is(':checked')
    const exibeinfoatribuicao = $("input[name='exibeinfoatribuicao']").is(':checked')

    function onError (error) {
      console.log(`Error: ${error}`)
    }
    function setItem () {
      console.log('OK')
    }

    const OptionsToSave = { theme, CheckTypes, formato, tipoConferencia, nivelAcesso, hipoteseLegal, filtraporatribuicao, ConfiguracoesCores, ConfPrazo, ConfDias, incluirDocAoArrastar_TipoDocPadrao, usardocumentocomomodelo, exibeinfoatribuicao }
    if (isChrome) {
      browser.storage.local.set(OptionsToSave)
    } else {
      browser.storage.local.set(OptionsToSave).then(setItem, onError)
    }
    alert('Salvo')
    window.location.assign(window.location.href)
  }
}
