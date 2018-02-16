function Options_ui(BaseName) {
  var mconsole = new __mconsole(BaseName + ".Options_ui");

  $("#divInfraAreaTelaD").append("<div id='seipp-div-options-ui'/>");

  $("#seipp-div-options-ui").load(
    browser.extension.getURL("cs_modules/options_ui/options_ui.html"), function () {
      $("#divInfraBarraComandosSuperior input").hide();
      $(".seipp-options-title").append(" - Versão: " + browser.runtime.getManifest().version);

      $("#divInfraBarraLocalizacao").css({
        "padding-left": "10px",
        "margin-top": "10px"
      });
      $("#frmInfraConfigurar, #seipp-div-options-ui").css({
        "border" : "2px solid",
        "padding": "10px",
        "margin-top": "10px"
      });

      OptionsLoad();
    }
  );

  /******************************************************************************
   * Atualiza o formulário com as configurações salvas.                         *
   ******************************************************************************/
  function OptionsLoad() {
    $("#theme").val(SavedOptions.theme);

    $("input[type='checkbox']").each(function () {
      if (SavedOptions.CheckTypes.indexOf($(this).attr("data-type")) != -1) {
        $(this).attr("checked", true);
        mconsole.log("checked");
      } else {
        $(this).attr("checked", false);
        mconsole.log("unchecked");
      }
    })

    if (SavedOptions.ConfiguracoesCores == undefined) { /* Se não existir esta configuração */
      SavedOptions.ConfiguracoesCores = DefaultOptions.ConfiguracoesCores;
    }
    $("#divConfigMarcarCorProcesso input[type='text']").each(function (index) {
      var item_cor = $(this);
      if (item_cor["0"].id.indexOf("cor_") != -1) {
        item_cor["0"].value = SavedOptions.ConfiguracoesCores[index].valor;
      }
    });

    $("#marcarcorprocesso").on("change", mostraDivConfigMarcarCorProcesso);

    $("#cliquemenos").on("change", mostraDivConfig);

    $("input[name='formato'][value="+SavedOptions.formato+"]").attr("checked", true);
    $("input[name='formato']").on("change", MostraTipoConferencia);
    $("#divtipoconferencia").hide();
    MostraTipoConferencia();

    $("#tipoconferencia").val(SavedOptions.tipoConferencia);

    mconsole.log("RESTRITO: " + SavedOptions.nivelAcesso);
    $("input[name='nivelAcesso']").on("change", MostraRestrito);
    $("input[name='nivelAcesso'][value="+SavedOptions.nivelAcesso+"]").attr("checked", true);
    MostraRestrito();

    $("#hipoteseLegal").val(SavedOptions.hipoteseLegal);

    mostraDivConfig();

    mostraDivConfigMarcarCorProcesso();

	$("#nomeUsuarioSistema").text(getNomeUsuarioSistema());
	$("#loginUsuarioSistema").text(getLoginUsuarioSistema());
	$("input[name='filtraporatribuicaoRadio']").val([(SavedOptions.filtraporatribuicao || 'login')]);
	$("#filtraporatribuicao").on("change", mostraFiltraPorAtribuicao);
	mostraFiltraPorAtribuicao();

    /* prazo */
    $("#prazoalerta").val(SavedOptions.ConfPrazo.Alerta);
    $("#prazocritico").val(SavedOptions.ConfPrazo.Critico);
    $("input[data-type='prazo']").on("click", function () {
      toggle($("#prazoOptions"), this.checked);
    }).trigger("change");

    /* dias */
    $("#qtddiasalerta").val(SavedOptions.ConfDias.Alerta);
    $("#qtddiascritico").val(SavedOptions.ConfDias.Critico);
    $("input[data-type='qtddias']").on("change", function () {
      toggle($("#qtddiasOptions"), this.checked);
    }).trigger("change");

    /* Salvar */
    $("#save-button").on("click", OptionsSave);

    if (SavedOptions.InstallOrUpdate) {
      SavedOptions.InstallOrUpdate = false;
      browser.storage.local.set(SavedOptions);
      $("#lnkConfiguracaoSistema img").css({'animation': 'none'});
    }
  }

  function getUsuarioSistema() {
	return document.getElementById('lnkUsuarioSistema').title;
  }

  function getNomeUsuarioSistema() {
	  let usuarioSistema = getUsuarioSistema();
	  return usuarioSistema.substring(0, usuarioSistema.indexOf(' - '));
  }

  function getLoginUsuarioSistema() {
	  let usuarioSistema = getUsuarioSistema();
	  return usuarioSistema.substring(usuarioSistema.indexOf(' - ') + 3, usuarioSistema.indexOf('/'));
  }

  function MostraTipoConferencia() {
	toggle($("#divtipoconferencia"), $("input[name='formato']:checked").val() == "D");
  }

  function MostraRestrito() {
	toggle($("#divhipoteseLegal"), $("#rdRestrito:checked").val() == "R");
  }

  function mostraDivConfigMarcarCorProcesso() {
	toggle($("#divConfigMarcarCorProcesso"), document.getElementById("marcarcorprocesso").checked);
  }

  function mostraDivConfig() {
	toggle($("#divFormato"), document.getElementById("cliquemenos").checked);
  }

  function mostraFiltraPorAtribuicao() {
	toggle($("#filtraporatribuicaoOptions"), document.getElementById("filtraporatribuicao").checked);
  }

  function toggle(elemento, valor) {
	let anim = "fast";
    if (valor)
      elemento.show(anim);
    else
      elemento.hide(anim);
  }

  function OptionsSave() {
    var CheckTypes = [];
    $("input[type='checkbox']:checked").each(function () {
      CheckTypes.push($(this).attr("data-type"));
    });


    var ConfiguracoesCores = [];
    $("input[type='text']").each(function () {
      var item_cor = $(this);
      if (item_cor["0"].id.indexOf("cor_") != -1) {
        var configuracao_cor = {cor: item_cor["0"].id.replace("cor_", "#"), valor: item_cor["0"].value};
        ConfiguracoesCores.push(configuracao_cor);
      }
    });

    var theme = $("#theme").val();
    var formato = $("input[name='formato']:checked").val();
    var tipoConferencia = $("#tipoconferencia").val();
    var nivelAcesso = $("input[name='nivelAcesso']:checked").val();
    var hipoteseLegal = $("#hipoteseLegal").val();
    var filtraporatribuicao = $("input[name='filtraporatribuicaoRadio']:checked").val();
    mconsole.log(nivelAcesso);

    /* Prazo / Dias */
    let ConfPrazo = { Critico: 0, Alerta: 0 };
    let ConfDias = { Critico: 0, Alerta: 0 };
    ConfPrazo.Alerta = parseInt($("#prazoalerta").val());
    ConfPrazo.Critico = parseInt($("#prazocritico").val());
    ConfDias.Alerta = parseInt($("#qtddiasalerta").val());
    ConfDias.Critico = parseInt($("#qtddiascritico").val());
    mconsole.log("CONFDIAS> alerta: " + ConfDias.Alerta + " critico:" + ConfDias.Critico);

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    var OptionsToSave = {theme, CheckTypes, formato, tipoConferencia, nivelAcesso, hipoteseLegal, filtraporatribuicao, ConfiguracoesCores, ConfPrazo, ConfDias };
    if (isChrome) {
      browser.storage.local.set(OptionsToSave);
    } else {
      browser.storage.local.set(OptionsToSave).then(null, onError);
    }
    alert("Salvo");
    window.location.assign(window.location.href);
  }
}