function ConfirmarAntesConcluir(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".ConfirmarAntesConcluir");

  let botao = document.querySelector('img[src="imagens/sei_concluir_processo.gif"]');
  if (botao) {
    let btnFunction = botao.parentElement.onclick;
    botao.parentElement.onclick = function() {
      if (confirm('Deseja mesmo concluir os processos selecionados?')) {
        btnFunction.call();
      }
    };
  }
}
