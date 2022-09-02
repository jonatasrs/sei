/* global __mconsole */
function selecionarMultiplosProcessos (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.selecionarMultiplosProcessos')

  let shifted = false
  let desativarClick = false

  const elementos = [
    { id: 'chkDetalhadoItem' },
    { id: 'chkRecebidosItem' },
    { id: 'chkGeradosItem' },
    { id: 'chkInfraItem' }
  ]

  function alteradoCheckbox (chkbox, element) {
    if (!desativarClick) {
      if (shifted) {
        const chkboxs = $(element.selectorCheckbox).get()
        const index1 = chkboxs.indexOf(chkbox)
        const index2 = chkboxs.indexOf(element.lastElement)

        if (index1 <= index2) { efetuarClique(chkboxs, index1, index2) } else { efetuarClique(chkboxs, index2, index1) }
      } else {
        element.lastElement = chkbox
      }
    }
  }

  function efetuarClique (array, index1, index2) {
    desativarClick = true
    for (let i = index1 + 1; i < index2; i++) {
      if (array[i].offsetParent !== null) { $(array[i]).click() }
    }
    desativarClick = false
  }

  $(document).on('keyup keydown', function (e) {
    shifted = e.shiftKey
    mconsole.log(`shiftKey ${shifted}`)
  })

  $.each(elementos, function (index, element) {
    element.selectorCheckbox = 'input:checkbox[id^="' + element.id + '"]'
    $(element.selectorCheckbox).click(function () {
      alteradoCheckbox(this, element)
    })
  })
}
