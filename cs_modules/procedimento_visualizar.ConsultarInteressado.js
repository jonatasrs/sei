function ConsultarInteressado(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarInteressado");

  /** Variaveis *****************************************************************/
  var processo = {numero: "",nome: "",sigla: "",servico: ""};

  processo.numero = $("#divArvore a:first span").text().replace(/\D/g, '');
  mconsole.log("Lendo dados do processo: " + processo.numero);
  DetalheProcesso_Criar();

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
    processo.servico = $(html).find("#selTipoProcedimento option[selected='selected']").text();
    processo.nome = $(html).find("#selInteressadosProcedimento option:first").text();

    a = processo.nome.indexOf('(') + 1;
    if (a != 0) {
      b = processo.nome.indexOf(')', a);
      processo.sigla = processo.nome.substring(a, b);
      processo.nome = processo.nome.substring(0, a - 2);
    }

    DetalheProcesso_Preencher();
  });

  /** Funções *******************************************************************/
  function DetalheProcesso_Criar(params) {
    $("#frmArvore").after("<div id='seipp_divp'/>");
    $("#seipp_divp").append("<div id='seipp_processo'/>");
    $("#seipp_divp").append("<div id='seipp_nome'/>");
    $("#seipp_divp").append("<div id='seipp_cpf'/>");
    $("#seipp_divp").append("<div id='seipp_servico'/>");
  }

  function DetalheProcesso_Preencher() {
    $("#seipp_processo").attr("value", processo.numero);
    $("#seipp_processo").text(processo.numero);
    $("#seipp_nome").attr("value", processo.nome);
    $("#seipp_nome").text(processo.nome);
    $("#seipp_cpf").text(processo.sigla);
    $("#seipp_servico").text(processo.servico);
  }
}