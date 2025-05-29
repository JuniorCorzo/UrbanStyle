package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;

public class SaveDocumentFailed extends RuntimeException {
    public SaveDocumentFailed(DocumentsName documentName) {
        super(String.format("Failed to save %s", documentName.getName()));
    }
}
