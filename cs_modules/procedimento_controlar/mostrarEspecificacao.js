/* global __mconsole, seiVersionCompare */
function mostrarEspecificacao (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.mostrarEspecificacao')
  const isVisualizacaoDetalhada = $('#divTabelaDetalhado').length > 0
  const column = seiVersionCompare('>', '4') ? 6 : 5

  mconsole.log('Está na visualização detalhada: ' + isVisualizacaoDetalhada ? 'Sim' : 'Não')
  if (isVisualizacaoDetalhada) {
    $('.infraTrClara').each(function (index) {
      const $element = $(this)
      const texto = $element.find('.processoVisualizado, .processoNaoVisualizado').attr('onmouseover')

      const especificacao = texto.substring(texto.indexOf('(\'') + 2, texto.indexOf(',') - 1)
      $element.find('td:nth-child(' + column + ')')
        .append('<br/>')
        .append('<span>' + especificacao + '</span>')
        .find('span')
        .css({ fontSize: '.9em', color: 'darkblue' })
        .attr('title', 'Especificação')
    })
  }
  mconsole.log('Finalizado.')
}
