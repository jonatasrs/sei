/* global __mconsole, seiVersionCompare */

/**
 * Move o link do menu para o lado esquerdo e adiciona um ícone.
 * Específica para o SEI 4
 *
 * @param {string} BaseName - Nome base.
 */
// eslint-disable-next-line no-unused-vars
function moveLinkMenu (BaseName) {
  const mconsole = new __mconsole(BaseName + '.moveLinkMenu')
  if (seiVersionCompare('>=', '5.0')) {
    mconsole.log('Versão do SEI >= 5.0, não é necessário mover o link do menu.')
    return
  }

  const menu = document.querySelector('#lnkInfraMenuSistema')

  if (menu) {
    const menuContainer = document.querySelector('#divInfraBarraSistemaPadraoE')
    if (menuContainer) {
      const div = document.createElement('div')
      const innerMenu = menu.querySelector('span')
      const img = document.createElement('img')
      img.src = currentBrowser.runtime.getURL('icons/menu.svg')
      img.alt = 'Menu'
      img.style.paddingRight = '10px'
      img.style.paddingTop = '10px'
      innerMenu.replaceWith(img)
      div.className = 'align-self-center'
      menu.className = 'align-self-center'
      div.appendChild(menu)
      menuContainer.prepend(div)
      document.querySelector('#divInfraBarraSistemaPadraoD #lnkInfraMenuSistema').remove()
      mconsole.log('Link do menu movido e ícone adicionado')
    }
  } else {
    mconsole.log('Link do menu não encontrado')
  }
}
