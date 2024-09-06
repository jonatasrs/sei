// Seleciona os dois campos de senha
const campoSenhaHidden = document.querySelector('input[name="pwdSenha"][style*="display: none;"]');
const campoSenhaVisible = document.getElementById("pwdSenha");

// Rearranja de maneira que o campo que esta visivel seja colocado primeiro
if (campoSenhaHidden && campoSenhaVisible) {
  const parentElement = campoSenhaHidden.parentNode;
  
  //Move o cmapo visivel para primeira posicao
  parentElement.insertBefore(campoSenhaVisible, campoSenhaHidden);
  
  // Forca o campo invisivel a nao usar autofill e campo textual
  campoSenhaHidden.setAttribute("autocomplete", "off");
  campoSenhaHidden.setAttribute("type", "text");  
  campoSenhaHidden.style.display = "none";

  // Modifica a o campo visivel para ser typo pwd e ter autocomplete
  campoSenhaVisible.setAttribute("type", "password");
  campoSenhaVisible.setAttribute("autocomplete", "on");

  campoSenhaVisible.focus();
}