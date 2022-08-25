/** Pega a versão atual do SEI */
function getSeiVersion (baseName) {
  const mconsole = new __mconsole(baseName + '.getSeiVersion')
  try {
    const script = document.querySelectorAll('script[src^="js/sei.js?"]')[0]
    const version = script.getAttribute('src').match(/(?<=\?)([^=-]+)/g)[0]
    const fixedVersion = fixVersionNumber(version)
    mconsole.log(fixedVersion)
    return fixedVersion
  } catch (error) {
    mconsole.error(error)
    return '0.0.0.0'
  }
}

function fixVersionNumber (version) {
  const arrVersao = version.split('.')
  if (arrVersao.length !== 4) {
    if (arrVersao.length > 4) {
      arrVersao.splice(4)
    } else {
      const n = 4 - arrVersao.length
      for (let i = 0; i < n; i++) {
        arrVersao.push(0)
      }
      arrVersao.fill(0, 4 - n, 4)
    }
  }
  return arrVersao.join('.')
}

/**
 * Compara uma versão com a versão atual do SEI/SUPER.
 * @param {string} operator operador de comparação. '===', '>', '>=', '<', '<='.
 * @param {string} version Versão a ser comparada. Ex.: '4.0.0.0'.
 * @returns Retorna true ou false.
 */
function seiVersionCompare (operator, version) {
  const { compare } = new Intl.Collator('pt-BR', { numeric: true })
  const result = compare(fixVersionNumber(version), seiVersion)
  switch (operator) {
    case '===':
    case '==':
      return result === 0
    case '>':
      return result === -1
    case '>=':
      return [0, -1].includes(result)
    case '<':
      return result === 1
    case '<=':
      return [0, 1].includes(result)
    default:
      return false
  }
}
