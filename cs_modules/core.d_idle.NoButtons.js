/*** REMOVE IMAGENS DE BOTÕES ***************************************/ 
/** 
 *
 * Remove as imagens dos botões do SEI, substituindo pelo texto do title ou do
 * alt
 *
 * **/
function NoButtons(BaseName){
  var mconsole = new __mconsole(BaseName + ".NoButtons");
  window.addEventListener('load', removerBotoes);
  //$('#ifrVisualizacao').ready(removeInFrame);
  var ifr = document.getElementById('ifrVisualizacao');
  ifr.addEventListener('load', removerBotoes);
}

function removerBotoes(event){
  var botoes = document.querySelectorAll("a.botaoSEI img");
  console.error("Botões!!!!!!!!!!!!", this, botoes);
  for ( var i=0; i<botoes.length; i++){
    var e = botoes[i];
    var message = e.getAttribute('title');
    if (!message){
      message = e.getAttribute('alt');
    }
    if (e.parentElement){
      var p = e.parentElement;
      p.innerHTML = message;
      p.style.display = "inline-block";
      p.style.margin = "2px 5px";
      p.style.fontSize = "1.6em";
    }
  }
}

