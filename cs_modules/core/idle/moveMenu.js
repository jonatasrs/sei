function moveMenu() {
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
      // menu.className = ''
      div.className = 'align-self-center'
      menu.className = 'align-self-center'
      div.appendChild(menu)
      menuContainer.prepend(div)
      document.querySelector('#divInfraBarraSistemaPadraoD #lnkInfraMenuSistema').remove()
    }
  }
}