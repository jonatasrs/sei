/** Roda quando a o carregamento do html termina */

function getSeiVersion () {
  try {
    const script = document.querySelectorAll('script[src^="js/sei.js?"]')[0]
    const versao = script.getAttribute('src').match(/(?<=\?)(.*)(?=-)/g)[0]
    return versao.split('.').map(e => Number(e))
  } catch (error) {
    console.error('getSeiVersion: ', error)
  }
}

/** Pega a versão atual do SEI */
seiVersion = getSeiVersion()
