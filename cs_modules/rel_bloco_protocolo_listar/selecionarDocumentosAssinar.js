/* global __mconsole */
/**
 * Dentro de um bloco de assinatura, adiciona opções que auxiliam a selecionar os documentos para assinar
 */

function selecionarDocumentosAssinar (BaseName) {
  /** inicialização do módulo ***************************************************/
  const mconsole = new __mconsole(BaseName + '.selecionarDocumentosAssinar')

  /* Verifica se o usuário está em um bloco de assinatura */
  const blocoDeAssinatura =
    document.querySelector('#divInfraBarraLocalizacao') &&
    /Bloco de Assinatura/.test(document.querySelector('#divInfraBarraLocalizacao').textContent) &&
    document.querySelector('#btnAssinar')

  if (!blocoDeAssinatura) return

  /* Extrai o nome do usuário do ícone superior. Vem em diferentes formatos, a depender da versão do SEI. */
  const usuarioCompleto = document.querySelector('#lnkUsuarioSistema').getAttribute('title')

  const UsuarioCompletoRE =
    usuarioCompleto.match(/(.+)\s-\s/) || /* NOME COMPLETO - usuário */
    usuarioCompleto.match(/(.+)\s\(.*/) || /* NOME COMPLETO (usuário/órgão) */
    null

  if (!UsuarioCompletoRE) {
    mconsole.log('Erro: não foi possível obter o nome do usuário.')
    return
  }

  const usuario = UsuarioCompletoRE[1]

  /* Adiciona os botões */
  const tabela = document.querySelector('#divInfraAreaTabela')

  /** Index da coluna de assinaturas */
  const indexAssinatura = [...tabela.querySelectorAll('tr> th')].reduce(
    (p, c, i) => c.innerText === 'Assinaturas' ? i : p, 6
  )

  const linhas = [...tabela.querySelectorAll('tbody > tr[id^="trSeq"], tbody > tr[id^="trPos"]')].map((tr) => ({
    checkbox: tr.querySelector('input[type="checkbox"]'),
    assinaturas: tr.querySelectorAll('td')[indexAssinatura]
  }))

  const opcoes = document.createElement('div')
  opcoes.classList.add('seipp-selecionar-documentos-assinar')
  opcoes.innerHTML = `
    <span>Selecionar:</span>
    <a href='#' id='btn-selecionar-todos-documentos'>Todos</a>
    <a href='#' id='btn-selecionar-nenhum-documento'>Nenhum</a>
    <a href='#' id='btn-selecionar-sem-assinatura'>Sem nenhuma assinatura</a>
    <a href='#' id='btn-selecionar-sem-minha-assinatura'>Sem a minha assinatura</a>
    <a href='#' id='btn-selecionar-com-minha-assinatura'>Com a minha assinatura</a>
  `

  tabela.querySelector('caption.infraCaption').insertAdjacentElement('beforeend', opcoes)

  opcoes.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') handleClick(e.target.id.replace('btn-selecionar-', ''))
    e.stopPropagation()
  }, true)

  const toggleCheckbox = (checkbox, checked) => {
    if (checked !== checkbox.checked) checkbox.click()
  }

  const handleClick = (type) => {
    for (const linha of linhas) {
      const assinaturas = linha.assinaturas.textContent.trim()

      /* seleciona todos documentos */
      if (type === 'todos-documentos') {
        toggleCheckbox(linha.checkbox, true)

        /* desseleciona todos documentos */
      } else if (type === 'nenhum-documento') {
        toggleCheckbox(linha.checkbox, false)

        /* seleciona somente os documentos que não possuem assinatura */
      } else if (type === 'sem-assinatura') {
        toggleCheckbox(linha.checkbox, (assinaturas.length === 0))

        /* seleciona somente os documentos que não possuem a assinatura do usuário */
      } else if (type === 'sem-minha-assinatura') {
        toggleCheckbox(linha.checkbox, !(assinaturas.length > 0 && assinaturas.includes(usuario)))

        /* seleciona somente os documentos que possuem a assinatura do usuário */
      } else if (type === 'com-minha-assinatura') {
        console.log(assinaturas, usuario, linha.assinaturas)
        toggleCheckbox(linha.checkbox, (assinaturas.length > 0 && assinaturas.includes(usuario)))
      }
    }
  }
}
