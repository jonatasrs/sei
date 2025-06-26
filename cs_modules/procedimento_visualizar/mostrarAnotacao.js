/* global __mconsole, GetBaseUrl, currentBrowser */
function MostrarAnotacao (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(`${BaseName}.MostrarAnotacao`)

  let txanotacao = ''
  let prioridade = false
  let hdnIdProtocolo = ''
  let hdnInfraTipoPagina = ''
  let postUrl = ''

  /** Pega a url de alteração do processo ***************************************/
  const head = document.head.innerHTML
  const a = head.indexOf('controlador.php?acao=anotacao_registrar&')
  if (a === -1) return
  const b = head.indexOf('"', a)
  const url = GetBaseUrl() + head.substring(a, b)

  const element = document.getElementById('container') || document.body

  // Criação dos containers principais
  const separador = document.createElement('div')
  separador.className = 'seipp-separador'
  const span = document.createElement('span')
  span.textContent = 'Anotações'
  separador.appendChild(span)

  const divAnotacao = document.createElement('div')
  divAnotacao.id = 'seipp_div_anotacao'

  element.append(separador, divAnotacao)

  // Utilitário para limpar filhos
  function clearChildren (el) {
    while (el.firstChild) el.removeChild(el.firstChild)
  }

  function mostrarNota () {
    /* limpa nota atual */
    clearChildren(divAnotacao)

    /* Pega o html da pagina de alteração do processo */
    mconsole.log('Carregado os dados...' + url)
    fetchSei(url)
      .then(html => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        txanotacao = doc.getElementById('txaDescricao')?.textContent || ''
        prioridade = !!doc.querySelector('#chkSinPrioridade:checked')
        hdnIdProtocolo = doc.getElementById('hdnIdProtocolo')?.value || ''
        hdnInfraTipoPagina = doc.getElementById('hdnInfraTipoPagina')?.value || ''
        postUrl = doc.getElementById('frmAnotacaoCadastro')?.getAttribute('action') || ''

        mconsole.log(`Prioridade: ${prioridade}`)
        mconsole.log(`txanotacao: ${txanotacao}`)
        mconsole.log(`hdnIdProtocolo: ${hdnIdProtocolo}`)
        mconsole.log(`hdnInfraTipoPagina: ${hdnInfraTipoPagina}`)
        mconsole.log(`postUrl: ${postUrl}`)

        criarElementoAnotacao()
        esconderSeNaoHaNota()
      })
      .catch(error => mconsole.log(error))
  }

  function criarElementoAnotacao () {
    // Sem anotação
    const divSemAnotacao = document.createElement('div')
    divSemAnotacao.className = 'seipp_sem_anotacao'
    const imgNota = document.createElement('img')
    imgNota.className = 'seipp_icone_nota'
    imgNota.src = currentBrowser.runtime.getURL('icons/note.png')
    divSemAnotacao.appendChild(imgNota)
    const pSem = document.createElement('p')
    pSem.appendChild(document.createTextNode('Este processo não possui anotações. '))
    const aCriar = document.createElement('a')
    aCriar.href = '#'
    aCriar.className = 'seipp_anotacao_criar_nota'
    aCriar.textContent = 'Clique aqui'
    pSem.appendChild(aCriar)
    pSem.appendChild(document.createTextNode(' para criar uma nota.'))
    divSemAnotacao.appendChild(pSem)

    // Com anotação
    const divAnotacaoBox = document.createElement('div')
    divAnotacaoBox.className = 'seipp_anotacao'

    // Botões
    const divBotoes = document.createElement('div')
    divBotoes.className = 'seipp_anotacao_botoes'
    const aRemover = document.createElement('a')
    aRemover.href = '#'
    aRemover.className = 'seipp_anotacao_botao seipp_anotacao_btn_remover'
    const imgRemover = document.createElement('img')
    imgRemover.className = 'seipp_anotacao_icone'
    imgRemover.src = currentBrowser.runtime.getURL('icons/removeNote.png')
    aRemover.appendChild(imgRemover)
    divBotoes.appendChild(aRemover)
    const aEditar = document.createElement('a')
    aEditar.href = '#'
    aEditar.className = 'seipp_anotacao_botao seipp_anotacao_btn_editar'
    const imgEditar = document.createElement('img')
    imgEditar.className = 'seipp_anotacao_icone'
    imgEditar.src = currentBrowser.runtime.getURL('icons/editNote.png')
    aEditar.appendChild(imgEditar)
    divBotoes.appendChild(aEditar)
    divAnotacaoBox.appendChild(divBotoes)

    // Texto da anotação
    const pTexto = document.createElement('p')
    pTexto.className = 'seipp_anotacao_texto'
    pTexto.textContent = txanotacao
    divAnotacaoBox.appendChild(pTexto)

    // Área de edição
    const divEditar = document.createElement('div')
    divEditar.className = 'seipp_anotacao_editar'
    divEditar.style.display = 'none'
    const textarea = document.createElement('textarea')
    textarea.className = 'seipp_anotacao_txt_editar'
    textarea.maxLength = 500
    divEditar.appendChild(textarea)

    // Prioridade
    const divPrioridade = document.createElement('div')
    divPrioridade.className = 'seipp_anotacao_prioridade'
    const chkPrioridade = document.createElement('input')
    chkPrioridade.type = 'checkbox'
    chkPrioridade.id = 'chkSinPrioridade'
    chkPrioridade.name = 'chkSinPrioridade'
    chkPrioridade.className = 'infraCheckbox'
    if (prioridade) chkPrioridade.checked = true
    const lblPrioridade = document.createElement('label')
    lblPrioridade.id = 'lblSinPrioridade'
    lblPrioridade.htmlFor = 'chkSinPrioridade'
    lblPrioridade.className = 'infraLabelCheckbox'
    lblPrioridade.textContent = 'Prioridade'
    divPrioridade.append(chkPrioridade, lblPrioridade)
    divEditar.appendChild(divPrioridade)

    // Botões editar/cancelar/salvar
    const divEditarBotoes = document.createElement('div')
    divEditarBotoes.className = 'seipp_anotacao_editar_botoes'
    const btnCancelar = document.createElement('button')
    btnCancelar.value = 'Cancelar'
    btnCancelar.className = 'infraButton seipp_anotacao_btn_cancelar_editar'
    btnCancelar.textContent = 'Cancelar'
    const btnSalvar = document.createElement('button')
    btnSalvar.value = 'Salvar'
    btnSalvar.className = 'infraButton seipp_anotacao_btn_salvar_edicao'
    btnSalvar.textContent = 'Salvar'
    divEditarBotoes.append(btnCancelar, btnSalvar)
    divEditar.appendChild(divEditarBotoes)
    divAnotacaoBox.appendChild(divEditar)

    // Adiciona ao DOM
    divAnotacao.append(divSemAnotacao, divAnotacaoBox)

    if (prioridade) divAnotacaoBox.classList.add('seipp-anotacao-red')

    // Eventos
    aEditar.addEventListener('click', e => {
      editarNota()
      e.preventDefault()
    })
    aCriar.addEventListener('click', e => {
      editarNota()
      e.preventDefault()
    })
    btnCancelar.addEventListener('click', e => {
      cancelarEditarNota()
      e.preventDefault()
    })
    btnSalvar.addEventListener('click', e => {
      salvarNota()
      e.preventDefault()
    })
    aRemover.addEventListener('click', e => {
      removerNota()
      e.preventDefault()
    })
  }

  function esconderSeNaoHaNota () {
    const divSem = divAnotacao.querySelector('.seipp_sem_anotacao')
    const divCom = divAnotacao.querySelector('.seipp_anotacao')
    if (txanotacao === '') {
      divCom.style.display = 'none'
      divSem.style.display = 'block'
    } else {
      divSem.style.display = 'none'
      divCom.style.display = 'block'
    }
  }

  function editarNota () {
    const divCom = divAnotacao.querySelector('.seipp_anotacao')
    const divBotoes = divCom.querySelector('.seipp_anotacao_botoes')
    const pTexto = divCom.querySelector('.seipp_anotacao_texto')
    const textarea = divCom.querySelector('.seipp_anotacao_txt_editar')
    const divEditar = divCom.querySelector('.seipp_anotacao_editar')
    divCom.removeAttribute('style')
    divAnotacao.querySelector('.seipp_sem_anotacao').style.display = 'none'
    divBotoes.style.display = 'none'
    textarea.style.width = `${pTexto.offsetWidth}px`
    pTexto.style.display = 'none'
    textarea.value = pTexto.textContent
    divEditar.style.display = 'block'
    textarea.focus()
  }

  function cancelarEditarNota () {
    esconderSeNaoHaNota()
    const divCom = divAnotacao.querySelector('.seipp_anotacao')
    divCom.querySelector('.seipp_anotacao_botoes').style.display = 'block'
    divCom.querySelector('.seipp_anotacao_texto').style.display = 'block'
    divCom.querySelector('.seipp_anotacao_editar').style.display = 'none'
  }

  function removerNota () {
    if (!confirm('Deseja remover a anotação deste processo?')) return
    const textarea = divAnotacao.querySelector('.seipp_anotacao_txt_editar')
    textarea.value = ''
    salvarNota()
  }

  // Kind of encodeURIComponent for ISO-8859-1
  function escapeComponent (str) {
    return escape(str).replace(/\+/g, '%2B')
  }

  function salvarNota () {
    const textarea = divAnotacao.querySelector('.seipp_anotacao_txt_editar')
    const txaDescricao = escapeComponent(textarea.value.trim())
    const chkPrioridade = divAnotacao.querySelector('#chkSinPrioridade')
    let chkSinPrioridade = chkPrioridade && chkPrioridade.checked ? 'on' : 'off'
    if (txaDescricao === '') chkSinPrioridade = 'off'

    fetch(`${GetBaseUrl()}${postUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `hdnInfraTipoPagina=${hdnInfraTipoPagina}&sbmRegistrarAnotacao=Salvar&txaDescricao=${txaDescricao}&hdnIdProtocolo=${hdnIdProtocolo}&chkSinPrioridade=${chkSinPrioridade}`
    }).then(mostrarNota)
  }

  /* mostra a nota assim que a página carregar */
  mostrarNota()
}
