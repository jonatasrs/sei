// CEPESC: 
function AdicionarNomeUsuario(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".AdicionarNomeUsuario");

  /** Adiciona o nome do usuário logado no sistema */
  var divBarra = $("#divInfraBarraSistemaE");
  var username = $('#lnkUsuarioSistema')[0].title.split("/")[0];
  var usernameDiv = document.createElement('div');
  var usernameAnchor = document.createElement('a');
  var icon = document.createElement("IMG");

  icon.src = "/infra_css/imagens/usuario.gif"

  usernameAnchor.innerHTML = username;
  usernameAnchor.style.color = "black";
  usernameAnchor.style.cursor = "default";
  icon.style.cursor = "default";
  usernameDiv.append(icon)
  usernameDiv.append(usernameAnchor);

  divBarra.append(usernameDiv);
}