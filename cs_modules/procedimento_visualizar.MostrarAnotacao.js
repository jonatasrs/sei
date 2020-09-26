function MostrarAnotacao(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".MostrarAnotacao");

  var txanotacao = "";
  var prioridade = false;
  var hdnIdProtocolo = "";
  var hdnInfraTipoPagina = "";
  var postUrl = "";

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=anotacao_registrar&");
  if (a == -1) return;
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);
  url = GetBaseUrl() + url;
  mconsole.log(url);

  let $element = $("#container").length > 0 ? $("#container") : $("body");
  $element.append(`<div id='seipp_div_anotacao'></div>`);

  function mostrarNota() {

    /* limpa nota atual */
    $('#seipp_div_anotacao').empty();

    /* Pega o html da pagina de alteração do processo */
    mconsole.log("Carregado os dados...");
    var WebHttp = $.ajax({ url: url });
    WebHttp.done(function (html) {
      txanotacao = $(html).find("#txaDescricao").text();
      prioridade = ($(html).find("#chkSinPrioridade:checked").length > 0) ? true : false;
      hdnIdProtocolo = $(html).find("#hdnIdProtocolo").val();
      hdnInfraTipoPagina = $(html).find("#hdnInfraTipoPagina").val();
      postUrl = $(html).find("#frmAnotacaoCadastro").attr('action');
      mconsole.log("Prioridade: " + prioridade);
      mconsole.log("Texto: " + txanotacao);
      mconsole.log("hdnIdProtocolo: " + hdnIdProtocolo);
      mconsole.log("hdnInfraTipoPagina: " + hdnInfraTipoPagina);
      mconsole.log("frmAnotacaoCadastro: " + hdnInfraTipoPagina);
      mconsole.log("postUrl: " + postUrl);

      
      if (txanotacao !== "") {
        $('#seipp_div_anotacao').append(`
          <div id='seipp_div_anotacao'>
            <div class='seipp_anotacao'>
              <a href='#' class='seipp_anotacao_btn_editar'></a>
              <p class='seipp_anotacao_texto'>${txanotacao}</p>
              <div class='seipp_anotacao_editar'>
                <textarea class='seipp_anotacao_txt_editar'></textarea>
                <div>
                  <button value="Cancelar" class="infraButton seipp_anotacao_btn_cancelar_editar">Cancelar</button>
                  <button value="Salvar" class="infraButton seipp_anotacao_btn_salvar_edicao">Salvar</button>
                </div>
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

        $('button.seipp_anotacao_btn_salvar_edicao').on('click', function(e) { 
          salvarNota();
          e.preventDefault();
        });      
      }
    });
  }

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

	// Kind of encodeURIComponent for ISO-8859-1
	function escapeComponent(str) {  
    return escape(str).replace(/\+/g, '%2B');
  }

  function salvarNota() {
    var txaDescricao = $('textarea.seipp_anotacao_txt_editar').val();
    txaDescricao = escapeComponent(txaDescricao);

    $.post({
      url: postUrl,
      contentType: 'application/x-www-form-urlencoded;charset=ISO-8859-1',
      data: `hdnInfraTipoPagina=${hdnInfraTipoPagina}&sbmRegistrarAnotacao=Salvar&txaDescricao=${txaDescricao}&hdnIdProtocolo=${hdnIdProtocolo}`,
      complete: function(jqXHR, textStatus ) {
        mostrarNota();
      }
    });

  }

  /* mostra a nota assim que a página carregar */
  mostrarNota();
}
