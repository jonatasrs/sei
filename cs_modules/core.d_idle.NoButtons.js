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
  var ifr = document.getElementById('ifrVisualizacao');
  ifr.addEventListener('load', removerBotoes);
}

function removerBotoes(event){
  var botoes = document.querySelectorAll("a.botaoSEI img");
  for ( var i=0; i<botoes.length; i++){
    var e = botoes[i];
    e.setAttribute('src','#');
    e.parentElement.classList.add('no-image');
  }
}

