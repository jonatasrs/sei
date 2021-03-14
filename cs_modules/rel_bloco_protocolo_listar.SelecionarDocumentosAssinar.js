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
    assinaturas: tr.querySelectorAll('td')[6].textContent.trim(),
  }));

	const opcoes = document.createElement('div');
  opcoes.classList.add('seipp-selecionar-documentos-assinar');
  opcoes.innerHTML = `
    <span>Selecionar:</span>
    <a href='#' id='btn-selecionar-todos-documentos'>[Todos]</a>
    <a href='#' id='btn-selecionar-nenhum-documento'>[Nenhum]</a>
    <a href='#' id='btn-selecionar-documentos-sem-assinatura'>[Sem nenhuma assinatura]</a>
    <a href='#' id='btn-selecionar-documentos-sem-minha-assinatura'>[Sem a minha assinatura]</a>
	`;

  tabela.querySelector('caption.infraCaption').insertAdjacentElement('beforeend', opcoes);

  opcoes.querySelector('#btn-selecionar-todos-documentos').addEventListener('click', (e) => {
    selecionarTodosDocumentos();
    e.preventDefault();
  });
  
  opcoes.querySelector('#btn-selecionar-nenhum-documento').addEventListener('click', (e) => {
    desselecionarTodosDocumentos();
    e.preventDefault();
  });
  
  opcoes.querySelector('#btn-selecionar-documentos-sem-assinatura').addEventListener('click', (e) => {
    selecionarSemAssinatura();
    e.preventDefault();
  });

  opcoes.querySelector('#btn-selecionar-documentos-sem-minha-assinatura').addEventListener('click', (e) => {
    selecionarSemMinhaAssinatura();
    e.preventDefault();
  });

  const selecionarTodosDocumentos = () => {
    for (let linha of linhas) {
      linha.checkbox.checked = true;
    }
  }
  
  const desselecionarTodosDocumentos = () => {
    for (let linha of linhas) {
      linha.checkbox.checked = false;
    }
  }
  
  const selecionarSemAssinatura = () => {
    for (let linha of linhas) {
      linha.checkbox.checked = (linha.assinaturas.length === 0);
    }
  }

  const selecionarSemMinhaAssinatura = () => {
    for (let linha of linhas) {
      linha.checkbox.checked = !(linha.assinaturas.length > 0 && linha.assinaturas.includes(nomeUsuario));
    }
  }

}