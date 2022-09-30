// atalhoPublicacoesEletronicas
function atalhoPublicacoesEletronicas (BaseName) {
  const mconsole = new __mconsole(BaseName + '.atalhoPublicacoesEletronicas')

  // Verifica se o link existe.
  const url = 'publicacoes/controlador_publicacoes.php?acao=publicacao_pesquisar&id_orgao_publicacao=0'
  const txtitle = 'Publicações Eletrônicas'
  const linkStyle = seiVersionCompare('>', '4')
    ? getProps()
    : $('#lnkAjuda').attr('style')
  const containerClass = seiVersionCompare('>', '4') ? 'nav-item d-md-flex' : 'infraAcaoBarraSistema'

  $.ajax({ url: GetBaseUrl() + url }).done(function () { AdicionarAtalho() })
    .fail(function () { mconsole.log('Página de publicações não existe') })

  function AdicionarAtalho () {
    $('#divInfraBarraSistemaD, #divInfraBarraSistemaPadraoD').prepend($('<div/>')
      .addClass(containerClass)
      .append($('<a>')
        .attr('href', url)
        .attr('title', txtitle)
        .attr('style', linkStyle)
        .attr('target', '_blank')
        .text(txtitle)
      )
    )
  }
}

function getProps () {
  const style = getComputedStyle(document.querySelector('.power-off-btn'))
  return `align-self: center; border: none; color: ${style.color}; font-size: ${style.fontSize};`
}
