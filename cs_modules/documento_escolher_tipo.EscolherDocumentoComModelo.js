function EscolherDocumentoComModelo(BaseName) {

    /** inicialização do módulo */
    var mconsole = new __mconsole(BaseName + ".EscolherDocumentoComModelo");

    
    function verificarSeHaModeloSalvo() {
        carregarDadosStorage({
            'seipp.procedimento_visualizar.DocumentoModelo.documento': null,
            'seipp.procedimento_visualizar.DocumentoModelo.descricao': null,
        }, function(dados) {
            if (
                dados['seipp.procedimento_visualizar.DocumentoModelo.documento'] &&
                dados['seipp.procedimento_visualizar.DocumentoModelo.descricao']
            ) {
                const dadosDocSEI = {
                    documento: dados['seipp.procedimento_visualizar.DocumentoModelo.documento'],
                    descricao: dados['seipp.procedimento_visualizar.DocumentoModelo.descricao'],
                };
                atualizarTitulo(dadosDocSEI);
            }

        })
    }


    function atualizarTitulo(dadosDocSEI) {
        const titulo = $('div.infraBarraLocalizacao');
        const subtitulo = $('<div />', {
            class: 'seipp-documento-modelo',
            text: `Modelo: SEI ${dadosDocSEI.documento}`,
        });
        titulo.append(subtitulo);
    }

    verificarSeHaModeloSalvo();

}
