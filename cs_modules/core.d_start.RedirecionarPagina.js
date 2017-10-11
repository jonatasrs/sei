/** Redireciona pagina para controle de processos */
function RedirecionarPagina(BaseName, num = 0) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".RedirecionarPagina");

  mconsole.log("Tentativa " + num);

  var menu = document.getElementById("main-menu");
  if (menu != null) {
    var links = menu.getElementsByTagName("a");
    for (var index in links) {
      if (links.hasOwnProperty(index)) {
        var element = links[index];

        if (element.getAttribute("href").indexOf("controlador.php?acao=procedimento_controlar") != -1) {
          window.location.assign(element.getAttribute("href"));
        }
      }
    }
  } else if (num < 6) {
    setTimeout(function () {
      RedirecionarPagina(BaseName, num + 1);
    }, 100);
  }
}