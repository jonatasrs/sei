function MostrarAnotacao(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".MostrarAnotacao");

  var txanotacao = "";
  var prioridade = false;

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=anotacao_registrar&");
  if (a == -1) return;
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);
  url = GetBaseUrl() + url;
  mconsole.log(url);

  /* Pega o html da pagina de alteração do processo */
  mconsole.log("Carregado os dados...");
  var WebHttp = $.ajax({ url: url });
  WebHttp.done(function (html) {
    txanotacao = $(html).find("#txaDescricao").text();
    prioridade = ($(html).find("#chkSinPrioridade:checked").length > 0) ? true : false;
        mconsole.log("Prioridade: " + prioridade);
    mconsole.log("Texto: " + txanotacao);

    let $element = $("#container").length > 0 ? $("#container") : $("body");
    if (txanotacao != "") {
      $element.append("<div id='seipp_div_anotacao'/>");
      $("#seipp_div_anotacao").append("<div class='seipp_anotacao'/>");
      $("#seipp_div_anotacao div.seipp_anotacao").append("<a href='#' class='seipp_anotacao_btn_editar'></a>");
      $("#seipp_div_anotacao div.seipp_anotacao").append("<p class='seipp_anotacao_texto'></p>");
      $("div.seipp_anotacao p.seipp_anotacao_texto").text(txanotacao);
      if (prioridade) {
        $("div.seipp_anotacao").addClass("seipp-anotacao-red");
      }
    }
  });
}
