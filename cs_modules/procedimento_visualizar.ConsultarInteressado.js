function ConsultarInteressado(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarInteressado");

  /** Variaveis *****************************************************************/
  var processo = {numero: "",nome: "",cpf: "",servico: ""};

  processo.numero = $("#divArvore a:first span").text().replace(/\D/g, '');
  mconsole.log("Lendo dados do processo: " + processo.numero);
  DetalheProcesso_Criar();

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=procedimento_alterar");
  if (a == -1) { a = head.indexOf("controlador.php?acao=procedimento_consultar");}
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);

  /* Pega o html da pagina de alteração do processo */
  var webhttp = new XMLHttpRequest();
  webhttp.open('GET', GetBaseUrl() + url, true);
  webhttp.onload = function () {
    var html = webhttp.responseText;

    a = html.indexOf('id=\"selTipoProcedimento');
    a = html.indexOf('selected=\"selected', a);
    a = html.indexOf('>', a) + 1;
    b = html.indexOf('<', a);
    processo.servico = html.substring(a, b);

    a = html.indexOf('id=\"selInteressadosProcedimento');
    a = html.indexOf('option', a);
    a = html.indexOf('>', a) + 1;
    b = html.indexOf('<', a);
    processo.nome = html.substring(a, b);

    a = processo.nome.indexOf('(') + 1;
    b = processo.nome.indexOf(')', a);
    processo.cpf = processo.nome.substring(a, b).replace(/\D/g, '');
    processo.nome = processo.nome.substring(0, a - 2);

    DetalheProcesso_Preencher();
  };
  webhttp.send();

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
    $("#seipp_cpf").text(format_cpf(processo.cpf));
    $("#seipp_servico").text(processo.servico);
  }
}

