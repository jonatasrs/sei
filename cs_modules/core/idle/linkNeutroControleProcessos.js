async function linkNeutroControleProcessos(BaseName) {
  const mconsole = new __mconsole(BaseName + '.linkNeutroControleProcessos')
  const elem = document.querySelector('#frmProcedimentoControlar')
  const link = {
    url: elem?.getAttribute('action')
  }

  if (link.url) {
    // salvar o link neutro no localStorage da webextension
    currentBrowser.storage.local.set({ linkNeutroControleProcessos: link.url })
    mconsole.log('Link neutro de controle de processos salvo: ' + link.url)
  } else {
    const { linkNeutroControleProcessos } = await currentBrowser.storage.local.get('linkNeutroControleProcessos')
    link.url = linkNeutroControleProcessos
    mconsole.log('Link neutro de controle de processos recuperado:' + link.url)
  }

  if (link.url) {
    const linkCP = document.querySelector('#lnkControleProcessos')
    linkCP?.setAttribute('href', link.url)
    linkCP?.removeAttribute('onclick')
    mconsole.log('Link neutro de controle de processos atualizado:' + linkCP?.href)
  }
}