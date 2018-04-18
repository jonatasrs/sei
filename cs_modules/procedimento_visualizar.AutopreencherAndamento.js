function AutopreencherAndamento(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".AutopreencherAndamento");
  var idmod = "seipp-aa";

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=procedimento_atualizar_andamento&");
  if (a == -1) return;
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);
  mconsole.log(url);
  ExecutarNaArvore(mconsole, verificaArvore);

  /****Auto preenchimento do andamento*******************************************/
  function enviarOficio(event) {
    $(parent.document.getElementById('ifrVisualizacao')).on("load", { name: event.data.name, sei: event.data.sei }, function (event) {
      var textoPadrao = "Solicita-se ao protocolo a expedição do %nome (SEI nº %num), por meio de Correspondência Simples Nacional com Aviso de Recebimento.";
      $(this).contents().find("#txaDescricao").val(textoPadrao.replace('%nome', event.data.name).replace('%num', event.data.sei));
      $(this).off("load");
    });
    AnimacaoFade(this);
  }

  function criaLink() {
    var link = $('<a><img src="' + browser.extension.getURL("icons/ect.png") + '" title="Preencher atualização de andamento (abra a tela de atualizar andamento antes de clicar!)"> </img></a>');
    var sp = $(this).find("span");
    if (sp.length == 0) return;
    if ($("#" + idmod + $(this).attr("id").substr(6)).length != 0) return;
    var text = sp.text();
    var inicio = text.indexOf("Ofício");
    var notif = text.indexOf("Notificação");
    var comunic = text.indexOf("Comunicado");
    var fim = text.indexOf("(");
    var nome = "";
    if ((inicio == 0) || (notif == 0) || (comunic == 0)) {
      nome = text.slice(0, fim);
      var num = text.substring(fim + 1, text.length - 2);
      mconsole.log("Link adicionado: " + nome + "- " + num);
      $(this).attr("style", "color:red");
      $(this).after(link);
      $(this).after('<img src="/infra_css/imagens/espaco.gif">');
      $(link).attr("id", idmod + $(this).attr("id").substr(6)).attr("href", url).attr("target", "ifrVisualizacao");
      link.click({ name: nome, sei: num }, enviarOficio);
    }
  }

  function verificaArvore() {
    $("#divArvore > div a[target='ifrVisualizacao']").each(criaLink);
  }
}