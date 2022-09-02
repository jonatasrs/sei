function AutopreencherAndamento (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.AutopreencherAndamento')
  const idmod = 'seipp-aa'

  /** Pega a url de alteração do processo ***************************************/
  const head = $('head').html()
  const a = head.indexOf('controlador.php?acao=procedimento_atualizar_andamento&')
  if (a === -1) return
  const b = head.indexOf('"', a)
  const url = head.substring(a, b)
  mconsole.log(url)
  ExecutarNaArvore(mconsole, verificaArvore)

  /** **Auto preenchimento do andamento*******************************************/
  function enviarOficio (event) {
    $(parent.document.getElementById('ifrVisualizacao')).on('load', { name: event.data.name, sei: event.data.sei }, function (event) {
      const textoPadrao = 'Solicita-se ao protocolo a expedição do %nome (SEI nº %num), por meio de Correspondência Simples Nacional com Aviso de Recebimento.'
      $(this).contents().find('#txaDescricao').val(textoPadrao.replace('%nome', event.data.name).replace('%num', event.data.sei))
      $(this).off('load')
    })
    AnimacaoFade(this)
  }

  function criaLink () {
    const link = $('<a><img src="' + browser.runtime.getURL('icons/ect.png') + '" title="Preencher atualização de andamento (abra a tela de atualizar andamento antes de clicar!)"> </img></a>')
    const sp = $(this).find('span')
    if (sp.length === 0) return
    if ($('#' + idmod + $(this).attr('id').substr(6)).length !== 0) return
    const text = sp.text()
    const inicio = text.indexOf('Ofício')
    const notif = text.indexOf('Notificação')
    const comunic = text.indexOf('Comunicado')
    const fim = text.indexOf('(')
    let nome = ''
    if ((inicio === 0) || (notif === 0) || (comunic === 0)) {
      nome = text.slice(0, fim)
      const num = text.substring(fim + 1, text.length - 2)
      mconsole.log('Link adicionado: ' + nome + '- ' + num)
      $(this).attr('style', 'color:red')
      $(this).after(link)
      $(this).after('<img src="/infra_css/imagens/espaco.gif">')
      $(link).attr('id', idmod + $(this).attr('id').substr(6)).attr('href', url).attr('target', 'ifrVisualizacao')
      link.click({ name: nome, sei: num }, enviarOficio)
    }
  }

  function verificaArvore () {
    $("#divArvore > div a[target='ifrVisualizacao']").each(criaLink)
  }
}
