// AtalhoPublicacoesEletronicas
function AtalhoPublicacoesEletronicas (BaseName) {
  const mconsole = new __mconsole(BaseName + '.AtalhoPublicacoesEletronicas')

  // Verifica se o link existe.
  const url = 'publicacoes/controlador_publicacoes.php?acao=publicacao_pesquisar&id_orgao_publicacao=0'
  const txtitle = 'Publicações Eletrônicas'
  const linkStyle = seiVersionCompare('>', '4')
    ? { alignSelf: 'center', border: 'none', color: 'var(--color-primary-default)', fontSize: '.75rem' }
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
        .css(linkStyle)
        .attr('target', '_blank')
        .text(txtitle)
      )
    )
  }
}
