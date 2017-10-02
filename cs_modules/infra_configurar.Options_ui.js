function Options_ui(BaseName) {
  var mconsole = new __mconsole(BaseName + ".Options_ui");

  $("#divInfraAreaTelaD").append("<div id='seipp-div-options-ui'/>");

  $("#seipp-div-options-ui").load(
    browser.extension.getURL("cs_modules/options_ui/options_ui.html"), function() {
      OptionsRun();
    }
  );

  /******************************************************************************
   * Atualiza o formulário com as configurações salvas.                         *
   ******************************************************************************/
  function OptionsRun() {
    $("#theme").val(SavedOptions.theme);

    $("input[type='checkbox']").each(function () {
      mconsole.log($(this).attr("data-type"));
      if (SavedOptions.CheckTypes.indexOf($(this).attr("data-type")) != -1) {
        $(this).attr("checked", true);
        mconsole.log("checked");
      } else {
        $(this).attr("checked", false);
        mconsole.log("unchecked");
      }
    })
    $("#cliquemenos").on("change", mostraDivConfig);
    mostraDivConfig();
    $("#save-button").on("click", OptionsSave);
  }

  function mostraDivConfig() {
    if (document.getElementById("cliquemenos").checked) {
      document.getElementById("divFormato").style.visibility = "visible";
    }
    else
      document.getElementById("divFormato").style.visibility = "hidden";
  }

  function OptionsSave() {
    var CheckTypes = [];
    $("input[type='checkbox']:checked").each(function () {
      CheckTypes.push($(this).attr("data-type"));
    });

    var theme = $("#theme").val();
    function GetFormato() {
      if ($("#rdNato").attr("checked"))
        return "N";
      else
        return "D";
    };
    var formato = GetFormato();
    function GetNivelAcesso() {
      if ($("#rdSigiloso").attr("checked"))
        return "S";
      else if ($("#rdRestrito").attr("checked"))
        return "R";
      else
        return "P";
    };
    var nivelAcesso = GetNivelAcesso();
    var hipoteseLegal = $("#hipoteseLegal").val();
    mconsole.log(nivelAcesso);

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    browser.storage.local.set({
      theme,
      CheckTypes,
      formato,
      nivelAcesso,
      hipoteseLegal
    }).then(null, onError);
    alert("Salvo");
  }
}