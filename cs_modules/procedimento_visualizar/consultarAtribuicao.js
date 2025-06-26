/* global __mconsole, seiVersionCompare */
function consultarAtribuicao (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.consultarAtribuicao')

  const unidadeAtual = obterUnidadeAtual()
  if (!unidadeAtual) return
  const dadosAtribuicao = obterAtribuicao(unidadeAtual)
  if (!dadosAtribuicao) return
  mconsole.log(`${unidadeAtual} - ${dadosAtribuicao}`)
  ConsultarInteressadoCriar(unidadeAtual, dadosAtribuicao)

  function ConsultarInteressadoCriar (unidadeAtual, dadosAtribuicao) {
    const container = $('#container').length > 0 ? $('#container') : $('body')

    // Criação segura dos elementos
    const $separador = $('<div/>').addClass('seipp-separador')
      .append($('<span/>').text(dadosAtribuicao.sigiloso ? 'Credencial para' : 'Atribuído para'))
    const $atribuicao = $('<div/>').attr('id', 'seipp_atribuicao')
    container.append($separador, $atribuicao)

    if (dadosAtribuicao.usuarios.length === 0) {
      $('#seipp_atribuicao').append($('<p />', {
        class: 'seipp-atribuido-para seipp-processo-sem-atribuicao',
        text: '(processo sem atribuição)'
      }))
    } else {
      dadosAtribuicao.usuarios.forEach(function (usuario) {
        const $p = $('<p />', {
          class: 'seipp-atribuido-para',
          title: dadosAtribuicao.sigiloso
            ? `Credencial para ${usuario.nome} (${usuario.login}) na unidade ${unidadeAtual}.`
            : `Atribuído na unidade ${unidadeAtual} para ${usuario.nome} (${usuario.login}).`
        })
        $p.append(
          $('<img />', {
            height: 10,
            width: 12,
            src: currentBrowser.runtime.getURL('icons/interessado.png')
          }),
          $('<span />').text(usuario.login)
        )
        $('#seipp_atribuicao').append($p)
      })
      if (dadosAtribuicao.sigiloso && typeof dadosAtribuicao.mais !== 'undefined' && dadosAtribuicao.mais > 0) {
        $('#seipp_atribuicao').append($('<p />', {
          class: 'seipp-atribuido-para seipp-atribuido-para-mais',
          text: `+${dadosAtribuicao.mais}`,
          title: `Mais ${dadosAtribuicao.mais} usuário(s) de outra(s) área(s).`
        }))
      }
    }
  }

  function obterUnidadeAtual () {
    const sei4 = seiVersionCompare('>=', '4')
    if (sei4) {
      return window.parent.document.querySelector('#lnkInfraUnidade').innerText
    } else {
      const selInfraUnidades = $("select[name='selInfraUnidades']", window.parent.document)
      if (!selInfraUnidades.length) return null
      const unidadeSelecionada = selInfraUnidades.find(':selected')
      if (!unidadeSelecionada.length) return null
      return unidadeSelecionada.text()
    }
  }

  function obterAtribuicao (unidade) {
    const ultimaScriptTag = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1]

    /* verificar se processo está aberto em alguma unidade */
    if (!/^Nos\[0\].html = 'Processo aberto/m.test(ultimaScriptTag.innerHTML)) return null

    /* extrai o que foi atribuído para a variável Nos[0].html */
    const rUsuarios = /^Nos\[0\].html = '(.*)';/m.exec(ultimaScriptTag.innerHTML)
    if (!rUsuarios || rUsuarios.length !== 2) return null
    const html = rUsuarios[1]

    /* caso de processos públicos ou restritos, busca por atribuição */
    if (/(Processo aberto nas unidades:|Processo aberto somente na unidade)/m.test(html)) {
      let regex = new RegExp(String.raw`(?<=<a alt=".*" title=".*" class="ancoraSigla">)${unidade}<\/a>(.*?)[\.]?<br \/>`, 'm')
      let resultado = regex.exec(html)
      if (resultado === null || resultado.length !== 2) return null /* processo não está aberto na unidade do usuário */
      const atribuicaoStr = resultado[1]
      regex = /\(atribuído para <a alt=".*" title="(.*?)" class="ancoraSigla">(.*?)<\/a>\)/m
      resultado = regex.exec(atribuicaoStr)
      if (resultado === null || resultado.length !== 3) return { sigiloso: false, usuarios: [] } /* processo está aberto na unidade do usuário, mas sem atribuição */
      return { sigiloso: false, usuarios: [{ nome: resultado[1], login: resultado[2] }] }

      /* caso de processos sigilosos, busca pro credenciais */
    } else if (/(Processo aberto com os usuários:|Processo aberto somente com o usuário)/m.test(html)) {
      const regex = /(?<=<a alt=".*?" title="(.*?)" class="ancoraSigla">(.*?))(?=<\/a>&nbsp;\/&nbsp;<a alt=".*?" title=".*?" class="ancoraSigla">(.*?)<\/a>)/g
      let m
      const usuarios = []
      let mais = 0
      while ((m = regex.exec(html)) !== null) {
        if (m.index === regex.lastIndex) regex.lastIndex++
        const [nome, login, unidade] = [m[1], m[2], m[3]]
        if (unidade === unidadeAtual) {
          usuarios.push({ nome, login })
        } else {
          mais++
        }
      }
      return { sigiloso: true, usuarios, mais }

    /* algum outro texto não identificado */
    } else {
      return null
    }
  }
}
