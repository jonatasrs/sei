function GerarDocumentoComModelo(BaseName) {

    /** inicialização do módulo */
    var mconsole = new __mconsole(BaseName + ".GerarDocumentoComModelo");

    /* busca no storage se teve algum documento modelo selecionado */
    function verificarSeHaModeloSelecionado() {
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
                especificarDocumentoModelo(dadosDocSEI.documento);
            }

        })
    }

    /* marca a caixa "Documento Modelo" com o documento modelo selecionado */
    function especificarDocumentoModelo(documento) {
        $('input#optProtocoloDocumentoTextoBase').prop( "checked", true );
        $('input#optProtocoloDocumentoTextoBase').click();
        $('input#txtProtocoloDocumentoTextoBase').val(documento);
    }
    
    verificarSeHaModeloSelecionado();

}
