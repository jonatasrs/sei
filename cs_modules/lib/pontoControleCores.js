/* global __mconsole, SavedOptions */
/* Funcionalidade de controle de cores dos pontos de controle
   Permite alterar as cores dos pontos de controle
*/

// eslint-disable-next-line no-unused-vars
function pontoControleCores (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.pontoControleCores')

  SavedOptions.pontoControleCores.forEach(e => {
    mconsole.log(`Alterando cor do ponto de controle que contem ${e.nome} para ${e.cor}`)
    const query = document.location.search.indexOf('acao=procedimento_visualizar') > 0
      ? `img[title*="${e.nome}" i]`
      : `a[aria-label*="${e.nome}" i] img`
    document.querySelectorAll(query).forEach(img => {
      // Aplica um filtro CSS para alterar a cor visualmente
      img.style.filter = e.filter
    })
  })
}
