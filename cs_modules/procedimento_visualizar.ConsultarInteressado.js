function ConsultarInteressado(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarInteressado");

  /** Variaveis *****************************************************************/
  var processo = {numero: "",interessado: "",sigla: "",tipo: ""};

  processo.numero = $("#divArvore > a > span[id^='span']").text().replace(/\D/g, '');
  mconsole.log("Lendo dados do processo: " + processo.numero);

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=procedimento_alterar");
  if (a == -1) { a = head.indexOf("controlador.php?acao=procedimento_consultar");}
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);
  url = GetBaseUrl() + url
  mconsole.log(url);

  /* Pega o html da pagina de alteração do processo */
  var WebHttp = $.ajax({ url: url });
  WebHttp.done(function (html) {
    let $html = $(html);
    processo.tipo = $html.find("#selTipoProcedimento option[selected='selected']").text();
    processo.interessado = $html.find("#selInteressadosProcedimento option:first").text();

    a = processo.interessado.indexOf('(') + 1;
    if (a != 0) {
      b = processo.interessado.indexOf(')', a);
      processo.sigla = processo.interessado.substring(a, b);
      processo.interessado = processo.interessado.substring(0, a - 1).trim();
    }

    DetalheProcesso_Criar();
    DetalheProcesso_Preencher();
  });

  /** Funções *******************************************************************/
  function DetalheProcesso_Criar(params) {
    $("#frmArvore").after("<div id='seipp_divp'/>");
    $("#seipp_divp").append("<div id='seipp_processo'/>");
    $("#seipp_divp").append("<div id='seipp_interessado'/>");
    $("#seipp_divp").append("<div id='seipp_sigla'/>");
    $("#seipp_divp").append("<div id='seipp_tipo'/>");
  }

  function DetalheProcesso_Preencher() {
    $("#seipp_processo").attr("value", processo.numero).attr("title", "Número do processo").text(processo.numero);
    $("#seipp_interessado").attr("value", processo.interessado).attr("title", "Nome do interessado").text(processo.interessado);
    $("#seipp_sigla").attr("title", "Sigla do interessado").text(processo.sigla);
    $("#seipp_tipo").attr("title", "Tipo de processo").text(processo.tipo);
  }
}