function AdicionarIdentificadorSeipp(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".AdicionarIdentificadorSeipp");

  /* Adiciona o indentificador ++ no logo do SEI */
  $("#divInfraBarraSistemaE").append("<div id='seipp'>++</div>");

  if (!isChrome) {
    browser.storage.local.get("version").then(function (params) {
      var version = parseInt(params.version);
      if (version < 56) {
        $("#seipp").attr("title", "Firefox " + version + " - Você está utilizando uma versão antiga do Firefox, não compativel com alguns recursos do SEI++")
          .css({ "font-weight": "bold", "color": "red", "filter": "none", "background-color": "black" });
      }
    }, null);
  }
}