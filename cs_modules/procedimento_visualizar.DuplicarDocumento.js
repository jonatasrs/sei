function DuplicarDocumento(BaseName) {

	/** inicialização do módulo ***************************************************/
	var mconsole = new __mconsole(BaseName + ".DuplicarDocumento");

    /* Adiciona ícone de duplicar documento */
    function adicionarIcone() {

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

            /* cria o ícone de duplicar */
            const linkDuplicar = $('<img>', {
                id: `seipp-dup${docId}`,
                title: 'Duplicar documento',
                src: browser.extension.getURL('icons/duplicar.png'),
            });

            /* adiciona o ícone */
            linkDocumento.after(linkDuplicar);
            linkDocumento.after($('<img />', { src: '/infra_css/imagens/espaco.gif' }));

            /* adiciona o evento */
            linkDuplicar.on('click', function(e) {
                AnimacaoFade(this);
                e.preventDefault();
            });

        });
	}

	ExecutarNaArvore(mconsole, adicionarIcone);
}