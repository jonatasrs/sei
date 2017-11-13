/*** MENU SUSPENSO ************************************************************/
function MenuSuspenso(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".MenuSuspenso");

  if (!$("#main-menu").length) return;

  if ($("#lnkInfraMenuSistema").attr("title").indexOf("Ocultar") != -1) {
		$("#divInfraAreaTelaD").width("99%");
		$("#divInfraAreaTelaE").hide();
  }
  /* Oculta o botao de exibir menu */
  $("#lnkInfraMenuSistema").hide();
  $("#divInfraAreaTelaE > div > p").hide();
  $("#divInfraAreaTelaE > div > img").attr("title", $("#divInfraAreaTelaE > div > p").text());
  $("#divInfraAreaTelaE > div > div").hide();

	$("#divInfraAreaTelaE").css({
		"position": "absolute",
		"display": "block",
    "width": "auto",
    "background-color" : "#d7d7d7"
  });

	$("#divInfraAreaTelaE > div").css({"border-bottom": "5px solid"});

	$("#divInfraBarraSistemaE img").click(function(e){
    e.stopPropagation(); /* impede a propagação do evento click */
    $("#divInfraAreaTelaE").toggle("fast");
  });

	$("#divInfraAreaTelaE").hide();
	$("#divInfraAreaTelaE").addClass("seipp-menu");
	$("#main-menu ul").addClass("seipp-menu");
	$("#divInfraAreaTelaE *").click(function(e){e.stopPropagation();})
	/* Oculta o menu ao clicar fora */
	$('body').click(function(){
		if (!$("#divInfraAreaTelaE").is(':hidden')){$("#divInfraAreaTelaE").toggle("fast");}
	});
}
