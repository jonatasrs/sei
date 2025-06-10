/* global ModuleInit, seiVersionCompare, EsperaCarregar, AjustarElementosNativos,
ConsultarInteressado, consultarAtribuicao, AutopreencherAndamento, copiarNumeroProcessoDocumento,
copiarLinkInterno, documentoModelo, MostrarAnotacao, dropzone, AbrirDocumentoNovaAba,
AlterarTitulo */
const BaseName = 'procedimento_visualizar'

function ExecutarNaArvore (Modlog, func) {
  EsperaCarregar(Modlog, '#divArvore > div', "a[target$='Visualizacao']", function () {
    func()
    $('#divArvore > div > div:hidden').each(function () {
      const idPasta = $(this).attr('id').substr(3)
      Modlog.log(idPasta + ' -> evento click adicionado.')
      $('#ancjoin' + idPasta).click(function () {
        EsperaCarregar(Modlog, '#div' + idPasta, "a[target$='Visualizacao']", func)
        $(this).off('click')
      })
    })
  })
}

ModuleInit(BaseName).then((options) => {
  /* Ajusta o design de alguns elementos nativos do SEI */
  AjustarElementosNativos()

  /* Mostra o tipo do processo e interessados */
  if (options.CheckTypes.includes('exibeinfointeressado')) ConsultarInteressado(BaseName)

  /* Mostra a quem o processo está atribuído */
  if (options.exibeinfoatribuicao) consultarAtribuicao(BaseName)

  /* Mostra botão atualizar andamento para envido de correspondências */
  if (options.CheckTypes.includes('autopreencher')) AutopreencherAndamento(BaseName)

  /* Mostra botão de copiar o número do processo ou do documento ao lado de cada documento e do processo */
  if (options.CheckTypes.includes('copiarnumeroprocessodocumento')) {
    if (seiVersionCompare('<', '4')) {
      copiarNumeroProcessoDocumento(BaseName)
    }
  }

  /* Mostra botão de copiar o link interno do processo ou de cada documento sem hash */
  if (options.CheckTypes.includes('copiarlinkinterno')) {
    if (seiVersionCompare('<', '4')) {
      copiarLinkInterno(BaseName)
    }
  }
  /* Mostra o botão de 'usar documento como modelo' */
  if (options.usardocumentocomomodelo) documentoModelo(BaseName)

  /* Mostra a anotação */
  if (options.CheckTypes.includes('mostraranotacao')) MostrarAnotacao(BaseName)

  /* Adiciona a funcionalidade de incluir documentos externos ao arrastar arquivos  */
  if (options.CheckTypes.includes('incluirdocaoarrastar')) dropzone.iniciar(BaseName)

  /* Adiciona a funcionalidade de abrir o documento em nova aba com o ctrl pressionado */
  AbrirDocumentoNovaAba(BaseName)

  /* Atualiza o título da janela/aba com os dados do processo  */
  if (seiVersionCompare('<', '4')) {
    AlterarTitulo(BaseName)
  }
}).catch(e => console.log(e.message))
