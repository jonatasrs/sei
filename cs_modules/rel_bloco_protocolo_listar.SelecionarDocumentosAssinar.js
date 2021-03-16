/**
 * Dentro de um bloco de assinatura, adiciona opções que auxiliam a selecionar os documentos para assinar
 */

function SelecionarDocumentosAssinar(BaseName) {

  /** inicialização do módulo ***************************************************/
    const mconsole = new __mconsole(BaseName + ".SelecionarDocumentosAssinar");

  /* Verifica se o usuário está em um bloco de assinatura */
  const blocoDeAssinatura = 
    document.querySelector('#divInfraBarraLocalizacao') &&
    /Bloco de Assinatura/.test(document.querySelector('#divInfraBarraLocalizacao').textContent) &&
    document.querySelector('#btnAssinar');
      
  
  if (!blocoDeAssinatura) return;

  /* busca o nome do usuário do cabeçalho */
  const nomeUsuario = document.querySelector('#lnkUsuarioSistema').getAttribute('title').match(/(.+)\s-\s/)[1];

  /* Adiciona os botões */
  const tabela = document.querySelector('#divInfraAreaTabela');

  const linhas = [...tabela.querySelectorAll('tbody > tr[id^="trSeq"]')].map((tr) => ({
    checkbox: tr.querySelector('input[type="checkbox"]'),
    assinaturas: tr.querySelectorAll('td')[6],
  }));

  const opcoes = document.createElement('div');
  opcoes.classList.add('seipp-selecionar-documentos-assinar');
  opcoes.innerHTML = `
    <span>Selecionar:</span>
    <a href='#' id='btn-selecionar-todos-documentos'>Todos</a>
    <a href='#' id='btn-selecionar-nenhum-documento'>Nenhum</a>
    <a href='#' id='btn-selecionar-sem-assinatura'>Sem nenhuma assinatura</a>
    <a href='#' id='btn-selecionar-sem-minha-assinatura'>Sem a minha assinatura</a>
    <a href='#' id='btn-selecionar-com-minha-assinatura'>Com a minha assinatura</a>
  `;

  tabela.querySelector('caption.infraCaption').insertAdjacentElement('beforeend', opcoes);

  opcoes.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') handleClick(e.target.id.replace('btn-selecionar-', ''));
    e.stopPropagation();
  }, true)

  const toggleCheckbox = (checkbox, checked) => {
     if (checked !== checkbox.checked) checkbox.click();
  }

  const handleClick = (type) => {
    for (let linha of linhas) {

      const assinaturas = linha.assinaturas.textContent.trim();

      /* seleciona todos documentos */
      if (type === 'todos-documentos') {
	toggleCheckbox(linha.checkbox, true);

      /* desseleciona todos documentos */
      } else if (type === 'nenhum-documento') {
        toggleCheckbox(linha.checkbox, false);

      /* seleciona somente os documentos que não possuem assinatura */
      } else if (type === 'sem-assinatura') {
        toggleCheckbox(linha.checkbox, (assinaturas.length === 0));

      /* seleciona somente os documentos que não possuem a assinatura do usuário */
      } else if (type === 'sem-minha-assinatura') {
	toggleCheckbox(linha.checkbox, !(assinaturas.length > 0 && assinaturas.includes(nomeUsuario)));

      /* seleciona somente os documentos que possuem a assinatura do usuário */
      } else if (type === 'com-minha-assinatura') {
	toggleCheckbox(linha.checkbox, (assinaturas.length > 0 && assinaturas.includes(nomeUsuario)));
      }


    }
  };


}