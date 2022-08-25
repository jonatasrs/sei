function theme (BaseName, tema) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.Theme')
  const NaoAplicarNestasPaginas = [
    'editor_montar',
    'documento_visualizar',
    'base_conhecimento_visualizar',
    'documento_imprimir_web',
    'bloco_navegar',
    'documento_download_anexo',
    'procedimento_paginar'
  ]

  if (AplicarLinkCss()) {
    AdicionarLinkCss(document, 'seipp-theme', 'cs_modules/themes/black.css')
    mconsole.log(document.baseURI)
  }

  function AplicarLinkCss () {
    let Aplicar = true
    NaoAplicarNestasPaginas.forEach(function (item) {
      if (document.baseURI.indexOf('acao=' + item) !== -1) { Aplicar = false }
    })
    // Identifica tela de login do SEI 4.0
    if (document.querySelectorAll('form[name=frmLogin]>div>#area-cards-login').length) {
      Aplicar = false
    }
    return Aplicar
  }
}
