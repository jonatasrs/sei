function ConsultarInteressado(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarInteressado");

  /** Variaveis *****************************************************************/
  var processo = { numero: "", interessados: [], tipo: "" };

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=procedimento_alterar&");
  if (a == -1) { a = head.indexOf("controlador.php?acao=procedimento_consultar&"); }
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
    processo.interessados = $html.find("#selInteressadosProcedimento option").map(function () { return $(this).text(); }).get();

    DetalheProcesso_Criar();
    DetalheProcesso_Preencher();
    ExibirDadosProcesso($html);
  });

  /** Funções *******************************************************************/
  function DetalheProcesso_Criar(params) {
    $("<div id='seipp_divp'/>")
      .insertAfter("#frmArvore")
      .append("<div id='seipp_processo'/>")
      .append("<div id='seipp_tipo'/>")
      .append("<div id='seipp_interessado'/>");

  }

  function DetalheProcesso_Preencher() {
    $("#seipp_processo").attr("value", processo.numero).attr("title", "Número do processo").text(processo.numero);
    $("#seipp_interessado").attr("value", processo.interessados).attr("title", "Nome do interessado").html(processo.interessados.join("<br>"));
    $("#seipp_tipo").attr("title", "Tipo de processo").text(processo.tipo);
  }

  function ExibirDadosProcesso($html) {
    setTimeout(function () {
      // https://stackoverflow.com/questions/726816/how-to-access-iframe-parent-page-using-jquery/726866
      // https://stackoverflow.com/questions/6316979/selecting-an-element-in-iframe-jquery
      var iframe = window.parent.document.getElementById('ifrVisualizacao');
      var $iframe = $(iframe);
      var mask_processo = $("#divArvore > a > span[id^='span']").text();
      var interessados = $html.find("#selInteressadosProcedimento option").map(function () { return $(this).text(); }).get();
      var descricao = $html.find("#txtDescricao").val();
      var data = $html.find("#txtDtaGeracaoExibir").val();
      mconsole.log(mask_processo);
      mconsole.log(interessados);
      mconsole.log(descricao);
      mconsole.log(data);

      $iframe.contents().find("#divInformacao").css('width', '300px');
      mconsole.log($iframe.prop("id"));

      $("<div id='detalhes' style='margin-left: 300px; border: 1px solid; padding: 2px;'/>")
        .insertAfter($iframe.contents().find("#divInformacao"))
        .append('<div id="divInfraBarraLocalizacao" class="infraBarraLocalizacao" style="display:block;">Dados do Processo</div>')
        .append('<div id="divProtocoloExibir" class="infraAreaDados" style="height:4.5em; clear: both;"><label id="lblProtocoloExibir" for="txtProtocoloExibir" accesskey="" class="infraLabelObrigatorio">Protocolo:</label><input id="txtProtocoloExibir" name="txtProtocoloExibir" class="infraText infraReadOnly" readonly="readonly" type="text" value="' + mask_processo + '"><label id="lblDtaGeracaoExibir" for="txtDtaGeracaoExibir" accesskey="" class="infraLabelObrigatorio" style="margin-left: 20px;">Data de Autuação:</label><input type="text" id="txtDtaGeracaoExibir" name="txtDtaGeracaoExibir" class="infraText infraReadOnly" readonly="readonly" /></div>')
        .append('<div id="divTipoProcedimento" class="infraAreaDados" style="height:4.5em; clear: none;"><label id="lblTipoProcedimento" for="selTipoProcedimento" accesskey="" class="infraLabelObrigatorio">Tipo do Processo:</label><input id="selTipoProcedimento" name="selTipoProcedimento" class="infraText infraReadOnly" readonly="readonly" style="width: 95%;" value="' + processo.tipo + '"></div>')
        .append('<div id="divDescricao" class="infraAreaDados" style="height:4.7em; clear: none;"><label id="lblDescricao" for="txtDescricao" accesskey="" class="infraLabelOpcional">Especificação:</label><input id="txtDescricao" name="txtDescricao" class="infraText infraReadOnly" readonly="readonly" type="text" style="width: 95%;"></div>')
        .append('<div id="divInteressados" class="infraAreaDados" style="height:11em; clear: none;"><label id="lblInteressadosProcedimento" for="txtInteressadoProcedimento" accesskey="I" class="infraLabelOpcional"><span class="infraTeclaAtalho">I</span>nteressados:</label><br/><textarea id="txtInteressadosProcedimento" name="txtInteressadosProcedimento" class="infraText infraReadOnly" readonly="readonly" style="width: 95%";>' + interessados.join("\n") + '</textarea></div>');

      var newiframe = window.parent.document.getElementById('ifrVisualizacao');
      var $newiframe = $(newiframe);

      $newiframe.contents().find("#txtDescricao").attr("value", descricao);
      $newiframe.contents().find("#txtDtaGeracaoExibir").attr("value", data);
      $newiframe.contents().find("#txtInteressadosProcedimento").css("height", "50px");

      mconsole.log("Fechou");
    }, 3000);
  }
}
