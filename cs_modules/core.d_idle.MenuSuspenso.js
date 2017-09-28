/*** MENU SUSPENSO ************************************************************/
function MenuSuspenso(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".MenuSuspenso");

  if ($("#lnkInfraMenuSistema").attr("title").indexOf("Ocultar") != -1) {
		$("#divInfraAreaTelaD").width("99%");
		$("#divInfraAreaTelaE").hide();
	}
	$("#lnkInfraMenuSistema").hide();
	$("#divInfraAreaTelaE").css({
		"position": "absolute",
		"display": "block",
		"width": "auto"
	});
	$("#divInfraBarraSistemaE img").click(function(e){
    e.stopPropagation(); /* impede a propagação do evento click */
    $("#divInfraAreaTelaE").css({"display": "block"});
		$("#main-menu").toggle("fast");
	});
	$("#main-menu").hide();
	$("#main-menu").addClass("seipp-menu");
	$("#main-menu ul").addClass("seipp-menu");
	$("#main-menu *").click(function(e){e.stopPropagation();})
	/* Oculta o menu ao clicar fora */
	$('body').click(function(){
		if (!$("#main-menu").is(':hidden')){$("#main-menu").toggle("fast");}
	});
}
