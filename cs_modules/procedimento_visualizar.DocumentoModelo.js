function DocumentoModelo(BaseName) {

	/** inicialização do módulo ***************************************************/
	var mconsole = new __mconsole(BaseName + ".DocumentoModelo");

    /* função que procura a url que aponta para incluir um novo documento */
    function obterURLNovoDoc() {
		const ultimaScriptTag = document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1];		
        const regex = /^Nos\[0\].acoes = '<a href="(controlador\.php\?acao=documento_escolher_tipo&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar.*?)"/m
		const resultado = regex.exec(ultimaScriptTag.innerHTML);
		if (resultado === null) return null;
		return resultado[1];
	};

    /* Adiciona ícone para usar documento como modelo */
    function adicionarIcone() {

        const urlNovoDoc = obterURLNovoDoc();
        if (!urlNovoDoc) return;

        mconsole.log(urlNovoDoc);

        /* procura por todos os links da árvore */
        const linksDocumentos = $('#divArvore a[id^="anchor"][target="ifrVisualizacao"][href^="controlador.php?acao=arvore_visualizar&acao_origem=procedimento_visualizar&id_procedimento="]');

        linksDocumentos.each(function() {
            
            const linkDocumento = $(this);
            const linkCopiar = linkDocumento.prev('a.clipboard');
            if (!linkCopiar.length) return true;
            const iconeCopiar = linkCopiar.find('img[id^="icon"]');
            if (!iconeCopiar.length) return true;
            if (iconeCopiar.attr('src') !== 'imagens/sei_documento_interno.gif') return true; /* filtra apenas os documentos internos */

            const docId = linkDocumento.attr('id').substr(6);

            /* cria o ícone de documento modelo */
            const linkModelo = $('<img>', {
                id: `seipp-dup${docId}`,
                title: 'Usar documento como modelo',
                src: browser.extension.getURL('icons/modelo.png'),
            });

            /* adiciona o ícone */
            linkDocumento.after(linkModelo);
            linkDocumento.after($('<img />', { src: '/infra_css/imagens/espaco.gif' }));

            /* adiciona o evento */
            linkModelo.on('click', function(e) {
                AnimacaoFade(this);
                const targetIframe = $(window.parent.document).find('iframe#ifrVisualizacao');
                targetIframe.attr('src', urlNovoDoc);
                e.preventDefault();
            });

        });
    }
    
	ExecutarNaArvore(mconsole, adicionarIcone);
}