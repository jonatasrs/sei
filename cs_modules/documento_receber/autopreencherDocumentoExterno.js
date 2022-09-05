/* global __mconsole */
function autopreencherDocumentoExterno (BaseName, settings) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.autopreencherDocumentoExterno')

  function autoFillDocument (formato, tipoConferencia, nivelAcesso, hipoteseLegal) {
    const data = new Date()
    const hoje = getFormattedDate(data)
    $('#txtDataElaboracao').val(hoje)

    setTimeout(function () {
      if (formato === 'N') {
        $('#optNato').attr('checked', 'checked')
        $('#optNato').click()
      } else if (formato === 'D') {
        $('#optDigitalizado').attr('checked', 'checked')
        $('#optDigitalizado').click()
        $('#selTipoConferencia').val(tipoConferencia)
      }
    }, 500)

    switch (nivelAcesso) {
      case 'R':
        $('#optRestrito').click()
        break
      case 'S':
        $('#optSigiloso').click()
        break
      default:
        $('#optPublico').click()
    }
    if (nivelAcesso === 'S' || nivelAcesso === 'R') {
      setTimeout(function () {
        $('#selHipoteseLegal').val(hipoteseLegal)
      }, 500)
    }
    const html = `<span style="background-color:red">
      Houve preenchimento de valores pré configurados nesta tela. Verifique se estão corretos!
    </span>`

    $('#divInfraBarraComandosInferior #btnSalvar').before(html)
    $('#divInfraBarraComandosSuperior #btnSalvar').before(html)
    mconsole.log('Finalizado')
  }
  function getFormattedDate (date) {
    const year = date.getFullYear()

    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : '0' + month

    let day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day

    return day + '/' + month + '/' + year
  }
  autoFillDocument(settings.formato, settings.tipoConferencia, settings.nivelAcesso, settings.hipoteseLegal)
}
