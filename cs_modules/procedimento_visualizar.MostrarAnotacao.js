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
      $element.append(`
        <div id='seipp_div_anotacao'>
          <div class='seipp_anotacao'>
            <a href='#' class='seipp_anotacao_btn_editar'></a>
            <p class='seipp_anotacao_texto'>${txanotacao}</p>
            <div class='seipp_anotacao_editar'>
              <textarea class='seipp_anotacao_txt_editar'></textarea>
              <button value="Cancelar" class="infraButton seipp_anotacao_btn_cancelar_editar">Cancelar</button>
              <button value="Salvar" class="infraButton seipp_anotacao_btn_salvar_edicao">Salvar</button>
            </div>
          </div>
        </div>
      `);
      if (prioridade) {
        $("div.seipp_anotacao").addClass("seipp-anotacao-red");
      }
      $('a.seipp_anotacao_btn_editar').on('click', function(e) { 
        editarNota();
        e.preventDefault();
      });

      $('button.seipp_anotacao_btn_cancelar_editar').on('click', function(e) { 
        cancelarEditarNota();
        e.preventDefault();
      });
    }
  });

  function editarNota() {
    $('a.seipp_anotacao_btn_editar').hide();
    $('textarea.seipp_anotacao_txt_editar').width($('p.seipp_anotacao_texto').width());
    $('p.seipp_anotacao_texto').hide();
    $('textarea.seipp_anotacao_txt_editar').text($('p.seipp_anotacao_texto').text());
    $('div.seipp_anotacao_editar').show();
  }

  function cancelarEditarNota() {
    $('a.seipp_anotacao_btn_editar').show();
    $('p.seipp_anotacao_texto').show();
    $('div.seipp_anotacao_editar').hide();
  }
}
