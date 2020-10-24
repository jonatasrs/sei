const BaseName = "procedimento_visualizar";

function ExecutarNaArvore(Modlog, func) {
  EsperaCarregar(Modlog, "#divArvore > div", "a[target='ifrVisualizacao']", function () {
    func();
    $("#divArvore > div > div:hidden").each(function () {
      var idPasta = $(this).attr("id").substr(3);
      Modlog.log(idPasta + " -> evento click adicionado.");
      $("#ancjoin" + idPasta).click(function () {
        EsperaCarregar(Modlog, "#div" + idPasta, "a[target='ifrVisualizacao']", func);
        $(this).off("click");
      });
    });
  });
}

if (ModuleInit(BaseName)) {


  /* Ajusta o design de alguns elementos nativos do SEI */
  AjustarElementosNativos();

  /* Mostra o tipo do processo e interessados */
  if (SavedOptions.CheckTypes.includes('exibeinfointeressado')) ConsultarInteressado(BaseName);
  
  /* Mostra a quem o processo está atribuído */
  if (SavedOptions.exibeinfoatribuicao) ConsultarAtribuicao(BaseName);

  /* Mostra botão atualizar andamento para envido de correspondências */
  if (SavedOptions.CheckTypes.includes('autopreencher')) AutopreencherAndamento(BaseName);

  /* Mostra botão de copiar o número do processo ou do documento ao lado de cada documento e do processo */
  if (SavedOptions.CheckTypes.includes('copiarnumeroprocessodocumento')) CopiarNumeroProcessoDocumento(BaseName);

  /* Mostra botão de copiar o link interno do processo ou de cada documento sem hash */
  if (SavedOptions.CheckTypes.includes('copiarlinkinterno')) CopiarLinkInterno(BaseName);

  /* Mostra o botão de 'usar documento como modelo' */
  if (SavedOptions.usardocumentocomomodelo) DocumentoModelo(BaseName);

  /* Mostra a anotação */
  if (SavedOptions.CheckTypes.includes('mostraranotacao')) MostrarAnotacao(BaseName);
  
  /* Adiciona a funcionalidade de incluir documentos externos ao arrastar arquivos  */
  if (SavedOptions.CheckTypes.includes('incluirdocaoarrastar')) Dropzone.iniciar(BaseName);

  /* Adiciona a funcionalidade de abrir o documento em nova aba com o ctrl pressionado */
  AbrirDocumentoNovaAba(BaseName);

  /* Atualiza o título da janela/aba com os dados do processo  */
  AlterarTitulo(BaseName);

}
