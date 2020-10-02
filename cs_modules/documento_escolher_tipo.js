const BaseName = "documento_escolher_tipo";

if (ModuleInit(BaseName)) {
    if (SavedOptions.usardocumentocomomodelo) {
        EscolherDocumentoComModelo(BaseName);
    }
}