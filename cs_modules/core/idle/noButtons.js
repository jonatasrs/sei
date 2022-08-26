/** * REMOVE IMAGENS DE BOTÕES ***************************************/
/**
 *
 * Remove as imagens dos botões do SEI, substituindo pelo texto do title ou do
 * alt
 *
 * **/
function noButtons (BaseName) {
  const mconsole = new __mconsole(BaseName + '.noButtons')
  const botoes = document.querySelectorAll('a.botaoSEI img')
  botoes.forEach(e => {
    e.setAttribute('src', '#')
    e.parentElement.classList.add('no-image')
  })
  if (botoes.length) {
    mconsole.log('Executado.')
  } else {
    mconsole.log('Nenhum botão encontrado')
  }
}
