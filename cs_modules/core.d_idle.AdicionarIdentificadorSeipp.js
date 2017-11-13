function AdicionarIdentificadorSeipp(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".AdicionarIdentificadorSeipp");

  /* Adiciona o indentificador ++ no logo do SEI */
	$("#divInfraBarraSistemaE").append("<div id='seipp'>++</div>");
}