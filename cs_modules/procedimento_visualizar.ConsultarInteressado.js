function ConsultarInteressado(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarInteressado");

  /** Variaveis *****************************************************************/
  var processo = {numero: "",interessado: "",descricao: "",tipo: ""};

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=procedimento_alterar&");
  if (a == -1) { a = head.indexOf("controlador.php?acao=procedimento_consultar&");}
  if (a == -1) {
    mconsole.log("Consulta não disponível para este processo!!!");
    return;
  }
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);
  url = GetBaseUrl() + url;
  mconsole.log(url);

  /* Pega o html da pagina de alteração do processo */
  var WebHttp = $.ajax({ url: url });
  WebHttp.done(function (html) {
    let $html = $(html);
    processo.numero = $("#divArvore > a > span[id^='span']").text().replace(/\D/g, '');
    mconsole.log("Lendo dados do processo: " + processo.numero);
    processo.tipo = $html.find("#selTipoProcedimento option[selected='selected']").text();
    processo.descricao = $html.find("#txtDescricao").text();
    processo.interessado = $html.find("#selInteressadosProcedimento").text();

    AjustaLargura();
    DetalheProcesso_Criar();
    DetalheProcesso_Preencher();
  });

  /** Funções *******************************************************************/
  function DetalheProcesso_Criar(params) {
    $("<div id='detalhes' style='margin-left: 300px; border: 1px solid #000;'/>")
      .insertAfter("#divInformacao")
      .append('<div id="divProtocoloExibir" class="infraAreaDados" style="height:4.5em; clear: none;"><label id="lblProtocoloExibir" for="txtProtocoloExibir" accesskey="" class="infraLabelObrigatorio">Protocolo:</label><input id="txtProtocoloExibir" name="txtProtocoloExibir" class="infraText infraReadOnly" readonly="readonly" type="text"><label id="lblDtaGeracaoExibir" for="txtDtaGeracaoExibir" accesskey="" class="infraLabelObrigatorio">Data de Autuação:</label><input id="txtDtaGeracaoExibir" name="txtDtaGeracaoExibir" class="infraText infraReadOnly" readonly="readonly" tabindex="507" type="text"></div>')
      .append('<div id="divTipoProcedimento" class="infraAreaDados" style="height:4.5em; clear: none;"><label id="lblTipoProcedimento" for="selTipoProcedimento" accesskey="" class="infraLabelObrigatorio">Tipo do Processo:</label><input id="selTipoProcedimento" name="selTipoProcedimento" class="infraText infraReadOnly" readonly="readonly" style="width: 300px;"></div>')
      .append('<div id="divDescricao" class="infraAreaDados" style="height:4.7em; clear: none;"><label id="lblDescricao" for="txtDescricao" accesskey="" class="infraLabelOpcional">Especificação:</label><input id="txtDescricao" name="txtDescricao" class="infraText infraReadOnly" type="text" style="width: 300px;"></div>')
      .after('<div id="divInteressados" class="infraAreaDados" style="height:11em; clear: none;"><label id="lblInteressadosProcedimento" for="txtInteressadoProcedimento" accesskey="I" class="infraLabelOpcional"><span class="infraTeclaAtalho">I</span>nteressados:</label><br/><textarea id="txtInteressadosProcedimento" name="txtInteressadosProcedimento" class="infraText infraReadOnly" readonly="readonly" style="width: 500px;"></textarea></div>');
  }

  function DetalheProcesso_Preencher() {
    $("#txtProtocoloExibir").attr("value", processo.numero);
    $("#txtInteressadosProcedimento").attr("text", processo.interessado);
    $("#txtDescricao").attr("value", processo.descricao);
    $("#selTipoProcedimento").attr("value", processo.tipo);
  }

  function AjustaLargura() {
    $("#divInformacao").css('width', '300px');
  }
}