function DocumentoModelo(BaseName) {

	/** inicialização do módulo ***************************************************/
    const mconsole = new __mconsole(BaseName + ".DocumentoModelo");
    const urlNovoDoc = obterURLNovoDoc();
    if (!urlNovoDoc) return;

    /* procura a url de incluir um novo documento */
    function obterURLNovoDoc() {
		const ultimaScriptTag = document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1];		
        const regex = /^Nos\[0\].acoes = '<a href="(controlador\.php\?acao=documento_escolher_tipo&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar.*?)"/m
		const resultado = regex.exec(ultimaScriptTag.innerHTML);
		if (resultado === null) return null;
		return resultado[1];
    };
    
    /* extrai os dados do documento SEI do link fornecido (descrição e documento SEI)  */
    function extrairDadosDocSEI(linkDocumento) {
        const span = linkDocumento.find('span');
        const regex = /^(.+)\s+\(?([0-9]{7,11})\)?$/.exec(span.attr('title'));
        if (!regex) return null;
        return {
            documento: regex[2],
            descricao: regex[1],
        }
    }

    /* salva os dados do documento modelo no storage e abre a página de escolher o tipo de documento */
    function abrirUrlNovoDoc(dadosDocSEI) {
        const data = {
            'seipp.procedimento_visualizar.DocumentoModelo.documento': dadosDocSEI.documento,
            'seipp.procedimento_visualizar.DocumentoModelo.descricao': dadosDocSEI.descricao,
        };
        salvarDadosStorage(data, function() {
            const targetIframe = $(window.parent.document).find('iframe#ifrVisualizacao');
            targetIframe.attr('src', urlNovoDoc);
        });
    }

    function limparDocumentoModelo() {
        salvarDadosStorage({
            'seipp.procedimento_visualizar.DocumentoModelo.documento': null,
            'seipp.procedimento_visualizar.DocumentoModelo.descricao': null,
        });        
    }

    /* Adiciona ícone para usar documento como modelo */
    function adicionarIcones() {

        /* procura por todos os links da árvore */
        const linksDocumentos = $('#divArvore a[id^="anchor"][target="ifrVisualizacao"][href^="controlador.php?acao=arvore_visualizar&acao_origem=procedimento_visualizar&id_procedimento="]');

        linksDocumentos.each(function() {
            
            const linkDocumento = $(this);

            const dadosDocSEI = extrairDadosDocSEI(linkDocumento);
            if (!dadosDocSEI) return true;

            const linkCopiar = linkDocumento.prev('a.clipboard');
            if (!linkCopiar.length) return true;
            const iconeCopiar = linkCopiar.find('img[id^="icon"]');
            if (!iconeCopiar.length) return true;
            if (iconeCopiar.attr('src') !== 'imagens/sei_documento_interno.gif') return true; /* filtra apenas os documentos internos */

            const docId = linkDocumento.attr('id').substr(6);
            const botaoId = `seipp-dup${docId}`;
            
            /* verifica se o botão já existe */
            if ($(`img#${botaoId}`).length > 0) return true;

            /* cria o ícone de documento modelo */
            const linkModelo = $('<img>', {
                id: botaoId,
                title: 'Usar documento como modelo',
                src: browser.extension.getURL('icons/modelo.png'),
            });

            /* adiciona o ícone ao lado do link do documento  */
            linkDocumento.after(linkModelo);
            linkDocumento.after($('<img />', { src: '/infra_css/imagens/espaco.gif' }));

            /* adiciona o evento */
            linkModelo.on('click', function(e) {
                AnimacaoFade(this);
                abrirUrlNovoDoc(dadosDocSEI);
                e.preventDefault();
            });

        });
    }
    
    ExecutarNaArvore(mconsole, adicionarIcones);
    
    /* toda vez que carrega a árvore, zera a referência do documento modelo */
    limparDocumentoModelo();
}