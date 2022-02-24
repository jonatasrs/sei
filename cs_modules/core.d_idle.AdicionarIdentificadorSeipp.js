function AdicionarIdentificadorSeipp (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.AdicionarIdentificadorSeipp2')

  /* Adiciona o identificador ++ no logo do SEI */
  console.log(seiVersion);
  const idLogo = seiVersion > [4, 0, 0] ? '#divInfraBarraSistemaPadraoE' : '#divInfraBarraSistemaE'
  $(idLogo).append('<div id="seipp">++</div>')

  if (!isChrome) {
    browser.storage.local.get('version').then(function (params) {
      const version = parseInt(params.version)
      mconsole.log(version)
      if (version < 68) {
        $('#seipp').attr('title', 'Firefox ' + version + ' - Você está utilizando uma versão antiga do Firefox, não compativel com alguns recursos do SEI++')
          .css({ 'font-weight': 'bold', color: 'red', filter: 'none', 'background-color': 'black' })
      }
    }, null)
  }
}
