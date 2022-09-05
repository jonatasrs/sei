/* global __mconsole, GetBaseUrl, RemoveAllOldEventListener */
/**
 * Força a reabertura do processo no protocolo quando o mesmo não está aberto
 * em nenhuma unidade.
 */
function ForcarReaberturaProcesso (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.ForcarReaberturaProcesso')

  if ($('#divUnidadesReabertura').css('display') === 'block') {
    /* Desabilita o botão de confirmação */
    $('#divInfraBarraComandosSuperior > #btnSalvar').attr('disabled', 'disabled')
    $('#divInfraBarraComandosInferior > #btnSalvar').attr('disabled', 'disabled')

    /* Localiza a url para encontrar as áreas do processo */
    const text = $('head').html()
    const a = text.indexOf('controlador.php?acao=unidade_selecionar_reabertura_processo')
    const b = text.indexOf("'", a)
    let url = text.substring(a, b)
    url = GetBaseUrl() + url
    mconsole.log('Url para verificar unidades: ' + url)

    /* Verifircar se o processo está aberto em alguma das unidades que passou */
    const WebHttp = $.ajax({ url })
    WebHttp.done(function (htmldata) {
      const html = $($.parseHTML(htmldata))

      const TUnidades = $(html).find('#divInfraAreaTabela > table > tbody > tr').length - 1
      mconsole.log('Total de unidades que o processo passou: ' + TUnidades)
      const TUnidFechado = $(html).find('#divInfraAreaTabela > table > tbody > tr > td > input').length
      mconsole.log('Total de unidades quo o processo está fechado: ' + TUnidFechado)

      /* Se tiver fechado em todas as unidades coloca alerta para reabrir */
      if (TUnidades === TUnidFechado) {
        const NovoConfirmarDados = "if($('#selUnidadesReabertura option').length>0){confirmarDados();} else {alert('O processo não está aberto em nenhuma unidade! Favor verificar');$('#selUnidadesReabertura').prop('style', 'background-color: red !important');}"
        $('#divInfraBarraComandosSuperior > #btnSalvar').attr('onclick', NovoConfirmarDados)
        $('#divInfraBarraComandosInferior > #btnSalvar').attr('onclick', NovoConfirmarDados)

        /* Remove os eventos antigos: Precisa para funcionar no Chrome */
        RemoveAllOldEventListener($('#divInfraBarraComandosSuperior > #btnSalvar'))
        RemoveAllOldEventListener($('#divInfraBarraComandosInferior > #btnSalvar'))
      }
      /* Habilita os botões novamente */
      $('#divInfraBarraComandosSuperior > #btnSalvar').removeAttr('disabled')
      $('#divInfraBarraComandosInferior > #btnSalvar').removeAttr('disabled')
    })
  }
}
