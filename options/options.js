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

  const theme = GetSelect();
  const CheckTypes = GetCheckboxs();
  browser.storage.local.set({
    theme,
    CheckTypes
  });
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
}

function onError(e) {
  console.error(e);
}

/******************************************************************************
 * Ao abrir a pagina de opções, pega as configurações salvas e atualiza o for-*
 * mulário.                                                                   *
 ******************************************************************************/
const PegarConfiguracoesSalvas = browser.storage.local.get();
PegarConfiguracoesSalvas.then(AtualizaForm, onError);

/******************************************************************************
 * Configura o botao salvar.                                                  *
 ******************************************************************************/
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", SalvarConfiguracoes);
