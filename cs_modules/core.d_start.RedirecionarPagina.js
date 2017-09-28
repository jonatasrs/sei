/** Redireciona pagina para controle de processos */
function RedirecionarPagina(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".RedirecionarPagina");

  if (window.location.href ==
    (window.location.protocol + "//" + window.location.hostname + "/sei/")) {
    setTimeout(function () {
      var links = document.getElementById("main-menu").getElementsByTagName("a");
      mconsole.log(links);
      for (var index in links) {
        if (links.hasOwnProperty(index)) {
          var element = links[index];

          if (element.getAttribute("href").indexOf("controlador.php?acao=procedimento_controlar") != -1) {
            window.location.assign(element.getAttribute("href"));
          }
        }
      }

    }, 200);
  }
}