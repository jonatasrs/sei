// CEPESC:
function addTabs(BaseName) {
    var mconsole = new __mconsole(BaseName + ".AdicionarTabs");

    var divTela = document.getElementById("frmProcedimentoControlar");

    // adiciona a classe 'tabcontent' às divs das tabelas 
    var divGerados = document.getElementById("divGerados");
    var divRecebidos = document.getElementById("divRecebidos");
    divGerados.className += ' tabcontent';
    divRecebidos.className += ' tabcontent';

    // cria div das abas com seus botões
    var tabs = document.createElement("div");

    var buttonRecebidos = document.createElement("button");
    var textRecebidos = document.createTextNode("Processos Recebidos");
    buttonRecebidos.appendChild(textRecebidos);
    buttonRecebidos.setAttribute("type", "button");
    buttonRecebidos.className += "btnFilter";
    buttonRecebidos.setAttribute("id", "btnRecebidos");
    buttonRecebidos.style.cursor = "pointer"
    buttonRecebidos.onclick = function () { openTab(divRecebidos) }
    tabs.appendChild(buttonRecebidos);

    var buttonGerados = document.createElement("button");
    var textGerados = document.createTextNode("Processos Gerados");
    buttonGerados.appendChild(textGerados);
    buttonGerados.setAttribute("type", "button");
    buttonGerados.className += "btnFilter";
    buttonGerados.setAttribute("id", "btnGerados");
    buttonGerados.style.cursor = "pointer"
    buttonGerados.onclick = function () { openTab(divGerados) }
    tabs.appendChild(buttonGerados);

    // adiciona as divs das abas 
    divTela.insertBefore(tabs, divTela.children[2]);

    // dá o click no botão da aba aberta, para que o botão evidencie a aba aberta quando a página for carregada
    firstButtonClick();
}

/*** Dá o primeiro click no botão correspondente à aba de processos que já está aberta */
function firstButtonClick() {
    var btnGerados = document.getElementById("btnGerados");
    var btnRecebidos = document.getElementById("btnRecebidos");

    var state = localStorage.getItem("state");

    if (state === "recebidos") {
        btnRecebidos.click();
    } else {
        btnGerados.click();
    }
}

/*** Mostra a div correspondente à aba clicada */
function openTab(divTable) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    var i;

    // Mostra a div da tabela pedida
    for (i = 0; i < tabcontent.length; i++) {
        if (divTable == tabcontent[i]) {
            tabcontent[i].style.display = "block";
        } else {
            tabcontent[i].style.display = "none";
        }
    }

    // Muda a cor do botão clicado, para evidenciar a aba selecionada
    var buttons = document.getElementsByClassName("btnFilter");
    var state;
    if (divTable.id === "divGerados") {
        buttons[1].style.borderColor = "rgb(4, 148, 199)";
        buttons[1].style.width = "75%";
        buttons[0].style.width = "20%";
        buttons[0].style.borderColor = "";
        buttons[0].style.color = "";

        state = "gerados";
        localStorage.setItem("state", state);
    } else if (divTable.id === "divRecebidos") {
        buttons[0].style.borderColor = "rgb(4, 148, 199)";
        buttons[0].style.width = "75%";
        buttons[1].style.width = "20%";
        buttons[1].style.borderColor = "";
        buttons[1].style.color = "";

        state = "recebidos";
        localStorage.setItem("state", state);
    }
}
