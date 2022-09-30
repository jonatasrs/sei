/* global __mconsole */
/** * MENU SUSPENSO ************************************************************/
function MenuSuspenso (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.MenuSuspenso')

  if ($('body').attr('onload').indexOf('infraMenuSistemaEsquema') !== -1) {
    $('body').attr('onload', $('body').attr('onload') + 'infraOcultarMenuSistemaEsquema();')
  }
  if (!$('#main-menu').length) return
  $('#main-menu, #divInfraAreaTelaE').hide()

  if ($('#lnkInfraMenuSistema').attr('title').indexOf('Ocultar') !== -1) {
    $('#divInfraAreaTelaD').width('99%')
  }
  /* Oculta o botao de exibir menu */
  $('#lnkInfraMenuSistema').hide()
  $('#divInfraAreaTelaE > div > p').hide()
  $('#divInfraAreaTelaE > div > img').attr('title', $('#divInfraAreaTelaE > div > p').text())
  $('#divInfraAreaTelaE > div > div').hide()

  $('#divInfraAreaTelaE').css({
    position: 'absolute',
    display: 'block',
    width: 'auto',
    'background-color': '#d7d7d7'
  })

  $('#divInfraAreaTelaE > div').css({ 'border-bottom': '5px solid' }).hide()

  $('#divInfraBarraSistemaE img').click(function (e) {
    e.stopPropagation() /* impede a propagação do evento click */
    if ($('#main-menu').attr('style') !== undefined) {
      $('#main-menu').removeAttr('style')
      $('#divInfraAreaTelaE').hide()
    }
    $('#divInfraAreaTelaE').toggle('fast')
    $('#divInfraAreaTelaE > div').show()
  })

  $('#divInfraAreaTelaE').addClass('seipp-menu')
  $('#main-menu ul').addClass('seipp-menu')
  $('#divInfraAreaTelaE *').click(function (e) { e.stopPropagation() })
  /* Oculta o menu ao clicar fora */
  $('body').click(function () {
    if (!$('#divInfraAreaTelaE').is(':hidden')) { $('#divInfraAreaTelaE').toggle('fast') }
  })
}
