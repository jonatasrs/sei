/******************************************************************************
 * Salva as configurações atuais usando browser.storage.local.                *
 ******************************************************************************/
function SalvarConfiguracoes() {
  function GetSelect() {
    const theme = document.querySelector("#theme");
    return theme.value;
  }

  function GetCheckboxs() {
    let CheckTypes = [];
    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
    for (let item of checkboxes) {
      if (item.checked) {
        CheckTypes.push(item.getAttribute("data-type"));
      }
    }
    return CheckTypes;
  }
  function getFormato() {
	if(document.querySelector("#rdNato").checked)
		return "N";
	else return "D";
  }
  function getNivelAcesso() {
	if(document.querySelector("#rdSigiloso").checked)
		return "S";
	else if(document.querySelector("#rdRestrito").checked)
			return "R";
		else return "P";
  }
  const formato = getFormato();
  const nivelAcesso = getNivelAcesso();
  const hipoteseLegal = document.querySelector("#hipoteseLegal").value
  const theme = GetSelect();
  const CheckTypes = GetCheckboxs();
  browser.storage.local.set({
    theme,
    CheckTypes,
	formato,
	nivelAcesso,
	hipoteseLegal
  });
  var date = new Date();
  var options = {day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false};
  document.getElementById("save-msg").textContent = "[ Salvo em " +
    new Intl.DateTimeFormat('pt-BR', options).format(date) + " ]";
}

/******************************************************************************
 * Atualiza o formulário com as configurações salvas.                         *
 ******************************************************************************/
function AtualizaForm(restoredSettings) {
  const selectList = document.querySelector("#theme");
  selectList.value = restoredSettings.theme;

  const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
  for (let item of checkboxes) {
    if (restoredSettings.CheckTypes.indexOf(item.getAttribute("data-type")) != -1) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  }
  document.getElementById("cliquemenos").addEventListener("change", mostraDivConfig);
  mostraDivConfig();
}

function mostraDivConfig() {
  if(document.getElementById("cliquemenos").checked){
    document.getElementById("divFormato").style.visibility = "visible";
  }
  else
    document.getElementById("divFormato").style.visibility = "hidden";
}

function onError(e) {
  console.error(e);
}

/******************************************************************************
 * Ao abrir a pagina de opções, pega as configurações salvas e atualiza o for-*
 * mulário.                                                                   *
 ******************************************************************************/
const isChrome = (typeof browser === "undefined"); /* Chrome: */
if (isChrome) {var browser = chrome;} /* Chrome: */

if (isChrome) { /* Chrome: */
	browser.storage.local.get(AtualizaForm);
} else {
	const PegarConfiguracoesSalvas = browser.storage.local.get();
	PegarConfiguracoesSalvas.then(AtualizaForm, onError);
}
/******************************************************************************
 * Configura o botao salvar.                                                  *
 ******************************************************************************/
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", SalvarConfiguracoes);
