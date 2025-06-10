async function linkNeutroControleProcessos() {
  const elem = document.querySelector('#frmProcedimentoControlar')
  const link = {
    url: elem?.getAttribute('action')
  }

  if (link.url) {
    // salvar o link neutro no localStorage da webextension
    currentBrowser.storage.local.set({ linkNeutroControleProcessos: link.url })
  } else {
    const { linkNeutroControleProcessos } = await currentBrowser.storage.local.get('linkNeutroControleProcessos')
    link.url = linkNeutroControleProcessos
  }

  if (link.url) {
    const linkCP = document.querySelector('#lnkControleProcessos')
    linkCP?.setAttribute('href', link.url)
    linkCP?.removeAttribute('onclick')
  }
}