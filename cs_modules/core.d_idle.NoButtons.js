/*** REMOVE IMAGENS DE BOTÕES ***************************************/ 
/** 
 *
 * Remove as imagens dos botões do SEI, substituindo pelo texto do title ou do
 * alt
 *
 * **/
function NoButtons(BaseName){
  var mconsole = new __mconsole(BaseName + ".NoButtons");
  console.error("vamos buscar");
  setTimeout(removerBotoes, 2000);
}
function removerBotoes(){
  console.log("No timeout");
  var botoes = document.querySelectorAll("a.botaoSEI img");
  for ( var i=0; i<botoes.length; i++){
    var e = botoes[i];
    var message = e.getAttribute('title');
    console.log(message, e , "será")
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
