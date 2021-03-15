// CEPESC:
// Ordena as colunas Especificação e Tipo, caso ativadas
function OrdenarColunas(BaseName) {
    /** inicialização do módulo */
    var mconsole = new __mconsole(BaseName + ".IncluirTipo");

    var indiceEspecificacao = $('th:contains("Especificação")').index();
    jQuery.each($("table tr"), function () {

        if (indiceEspecificacao > -1) {
            var from = ":eq(" + indiceEspecificacao + ")";
            var to = ":eq(2)"
            $(this).children(to).after($(this).children(from))
        }
    });

    var indiceTipo = $('th:contains("Tipo")').index();
    jQuery.each($("table tr"), function () {

        if (indiceTipo > -1) {
            var from = ":eq(" + indiceTipo + ")";
            var to = ":eq(2)"
            $(this).children(to).after($(this).children(from))
        }
    });


    // adequa a ordem dos campos de filtro de acordo com a nova ordem de colunas
    var filterRow = $(".tablesorter-filter-row")
    var i = 0;
    var j = 0;

    for (i = 0; i < filterRow.length; i++) {
        for (j = 0; j < filterRow[i].childElementCount; j++) {
            var input = $(filterRow[i].childNodes[j].firstChild)
            input.attr("data-column", j);
        }
    }
}