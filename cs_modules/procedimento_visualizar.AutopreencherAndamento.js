function AutopreencherAndamento(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".AutopreencherAndamento");
	setTimeout(verificaArvore, 500);
    

  /****Auto preenchimento do andamento*******************************************/
  function enviarOficio(event){
    var textoPadrao = "Solicita-se ao protocolo a expedição do %nome (SEI nº %num), por meio de Correspondência Simples Nacional com Aviso de Recebimento.";
    $(parent.document.getElementById('ifrVisualizacao')).contents().find("#txaDescricao").val(textoPadrao.replace('%nome', event.data.name).replace('%num', event.data.sei));
  }

  function criaLink(i, e){
    var link = $('<a><img src="'+browser.extension.getURL("icons/ect.png")+'" title="Preencher atualização de andamento (abra a tela de atualizar andamento antes de clicar!)"> </img></a>');
    var sp = $(this).find("span");
    var text = sp.text();
    var inicio = text.indexOf("Ofício");
    var notif = text.indexOf("Notificação");
    var comunic = text.indexOf("Comunicado");
    var fim = text.indexOf("(");
    var nome = "";
    if((inicio == 0)||(notif == 0)||(comunic == 0)){
      nome = text.slice(0, fim);
      var num = text.substring(fim + 1, text.length - 2);
      mconsole.log(nome + "- " + num);
      $(this).attr("style","color:red");
      $(this).after(link);
      $(this).after('<img src="/infra_css/imagens/espaco.gif">');
      link.click({name: nome, sei: num},enviarOficio);
    }

  }
  function verificaArvore(){
    $("div[class='infraArvore']:last a[target='ifrVisualizacao']").each(criaLink);
  }
}