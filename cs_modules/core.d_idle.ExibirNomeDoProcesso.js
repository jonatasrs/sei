function ExibirNomeDoProcesso(BaseName) {
  /** inicialização do módulo */
  //mconsole.log("entrou1");
  //var mconsole = new __mconsole(BaseName + ".ExibirNomeDoProcesso");
  //mconsole.log("entrou2");

  var processos = document.getElementsByClassName("processoVisualizado");
  var p = null;
  for (var i = 0; i < processos.length; i++) {
    p = processos[i];
    t = p.outerHTML;
    t = t.substring(t.lastIndexOf("('") + 2,t.lastIndexOf(",") -1);
    
    if (t.length > 0){
         p.innerText = t;
    }
  }
}
