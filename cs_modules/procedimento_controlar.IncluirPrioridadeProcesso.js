function IncluirPrioridadeProcesso(BaseName, TipoDeCalculo, Cores) {
    /** inicialização do módulo */

    var mconsole = new __mconsole(BaseName + ".IncluirPrioridadeProcesso");

    IncluirCorTabela("#tblProcessosDetalhado", TipoDeCalculo, Cores);
    IncluirCorTabela("#tblProcessosGerados", TipoDeCalculo, Cores);
    IncluirCorTabela("#tblProcessosRecebidos", TipoDeCalculo, Cores);

    function IncluirCorTabela(IdTabela, TipoDeCalculo, Cores) {
        var tabela = $(IdTabela);

        if ($(IdTabela).length > 0) {
            /* Remove os eventos da tabela: Precisa para funcionar no Chrome */
            RemoveAllOldEventListener(tabela);
            tabela = $(IdTabela);

            for (i = 1; i < tabela["0"].rows.length; i++) {
                var cor = EscolherCor(tabela["0"].rows[i].cells[2].innerHTML, Cores);
                FormatarTabela(tabela["0"].rows[i].cells["2"].children["0"], cor, TipoDeCalculo);
            }
        }
    }

    function EscolherCor(item, Cores) {
        for (contador = 0; contador < Cores.length; contador++) {
            if (item.indexOf(Cores[contador].valor) != "") {
                if (item.indexOf(Cores[contador].valor) != -1) {
                    return Cores[contador].cor;
                }
            }
        }
        return "";
    }

    /* Formata a tabela pelos valores */
    function FormatarTabela(Linha, Cor, TipoDeCalculo) {
        if (TipoDeCalculo == "prioridade") {
            if (Cor != "") {
                $(Linha).attr("style", "background-color: " + Cor + "; padding: 0 1em 0 1em");
            }
        }
    }
}