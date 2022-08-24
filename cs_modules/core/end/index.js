/** Roda quando a o carregamento do html termina */

function getSeiVersion () {
  var mconsole = new __mconsole('getSeiVersion')
  try {
    const script = document.querySelectorAll('script[src^="js/sei.js?"]')[0]
    const versao = script.getAttribute('src').match(/(?<=\?)([^=-]+)/g)[0]
    versao.split('.').forEach((value, index) => {
      seiVersion[index] = Number(value)
    })
    mconsole.log(seiVersion.join('.'))
  } catch (error) {
    mconsole.error(error)
  }
}

/** Pega a versão atual do SEI */
getSeiVersion()
